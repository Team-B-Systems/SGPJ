import { EstadoFuncionario, NomeDepartamento, PrismaClient, Role, TipoEvento } from "@prisma/client";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { comparePassword, hashPassword } from "../../utils/hash";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import ApiException from "../../common/Exceptions/api.exception";

import { logEvent } from "../events/events.service";

const prisma = new PrismaClient();

export const signup = async (dto: SignupDto) => {
  const existingUser = await prisma.funcionario.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new ApiException(400, "Requisição inválida")
  }

  const hashedsenha = await hashPassword(dto.senha);

  const departamento = await prisma.departamento.findFirst({
    where: { nome: dto.departamento },
  });

  if (!departamento) {
    throw new ApiException(404, "Departamento não encontrado");
  }

  const newUser = await prisma.funcionario.create({
    data: {
      nome: dto.nome,
      numeroIdentificacao: dto.numeroIdentificacao,
      email: dto.email,
      categoria: dto.categoria,
      senha: hashedsenha,
      estado: dto.estado,
      role: dto.role,
      departamentoId: departamento.id,
    }
  });

  await logEvent({
    funcionarioId: newUser.id,
    entidade: "Funcionário",
    entidadeId: newUser.id,
    tipoEvento: TipoEvento.CREATE,
    descricao: `Conta criada para o funcionário ${newUser.nome} (${newUser.email})`,
  });

  const { id, ...sanitizedUser } = newUser;

  return sanitizedUser;
};

export const login = async (dto: LoginDto) => {
  const user = await prisma.funcionario.findUnique({ where: { email: dto.email } });

  if (!user) throw new ApiException(401, "Credenciais incorretas");

  if (user.role !== Role.Admin) {
    const departamento = await prisma.departamento.findUnique({
      where: { id: user.departamentoId },
    });

    if (!departamento || departamento.nome !== NomeDepartamento.Jurídico) {
      throw new ApiException(401, "Credenciais incorretas");
    }
  }


  const isValid = await comparePassword(dto.senha, user.senha);
  if (!isValid) throw new ApiException(401, "Credenciais incorretas");

  // Se não tem 2FA → JWT normal
  if (!user.twoFactorSecret) {
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "5d" }
    );

    const { senha, ...sanitizedUser } = user;

    return { token, user: { ...sanitizedUser } };
  }

  // Se tem 2FA → token temporário
  const tempToken = jwt.sign(
    { userId: user.id, is2FA: true },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "5m" } // só para validar o 2FA
  );

  return { requires2FA: true, tempToken };
};

export const changePassword = async (userId: number, oldPassword: string, newPassword: string) => {
  const user = await prisma.funcionario.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiException(404, "Utilizador não encontrado");
  }

  const isValid = await comparePassword(oldPassword, user.senha);

  if (!isValid) {
    throw new ApiException(401, "Senha antiga inválida");
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.funcionario.update({
    where: { id: userId },
    data: { senha: hashedNewPassword, estado: EstadoFuncionario.Ativo },
  });

  await logEvent({
    funcionarioId: user.id,
    entidade: "Funcionário",
    entidadeId: user.id,
    tipoEvento: TipoEvento.UPDATE,
    descricao: `Senha alterada para o funcionário ${user.nome} (${user.email})`,
  });

  return { message: "Senha alterada com sucesso" };
}

// Gera segredo para o utilizador
export const generate2FASecret = async (userId: number) => {
  const user = await prisma.funcionario.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiException(404, "Utilizador não encontrado");
  }

  const secret = speakeasy.generateSecret({
    name: user.email,
  });

  // Guarda o secret em base32
  await prisma.funcionario.update({
    where: { id: userId },
    data: { twoFactorSecret: secret.base32 },
  });

  // Retorna o QR code para ser escaneado
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

  await logEvent({
    funcionarioId: userId,
    entidade: "Funcionário",
    entidadeId: userId,
    tipoEvento: TipoEvento.UPDATE,
    descricao: `Secret 2FA gerado para o funcionário ID ${userId}`,
  });

  console.log({ qrCodeUrl, secret: secret.base32 })

  return { qrCodeUrl, secret: secret.base32 };
};

export const verify2FA = async (tempToken: string, code: string) => {
  let payload: any;
  try {
    payload = jwt.verify(tempToken, process.env.JWT_SECRET || "secret");
  } catch {
    throw new ApiException(401, "Sessão expirada");
  }

  const user = await prisma.funcionario.findUnique({
    where: { id: payload.userId },
  });

  if (!user || !user.twoFactorSecret) {
    throw new ApiException(400, "2FA não configurado");
  }

  console.log({
    userId: payload.userId,
    twoFactorSecret: user.twoFactorSecret,
    code: code,
  })

  const currentCode = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: "base32",
  });
  console.log("Esperado:", currentCode, "Recebido:", code);

  const timeNow = Math.floor(Date.now() / 1000);
  console.log("Unix time:", timeNow);

  const serverCode = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: "base32",
    time: timeNow,
  });
  console.log("Código servidor:", serverCode);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 20,
  });

  if (!verified) {
    throw new ApiException(401, "Código inválido");
  }

  // Se válido → agora sim gera o JWT final
  const jwtToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "5d" }
  );

  return { token: jwtToken };
};
