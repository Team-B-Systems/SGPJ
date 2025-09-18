import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../utils/hash";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import ApiException from "../../common/Exceptions/api.exception";

const prisma = new PrismaClient();

export const signup = async (dto: SignupDto) => {
    const existingUser = await prisma.funcionario.findUnique({
            where: { email: dto.email },
        });
    
        if (existingUser){
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
  
        const { id, ...sanitizedUser } = newUser;
    
        return sanitizedUser;
};

export const login = async (dto: LoginDto) => {
    const user = await prisma.funcionario.findUnique({
        where: { email: dto.email },
    });

    console.log({ ...dto });

    if (!user) {
        throw new ApiException(401, "Credenciais inválidas");
    }

    const isValid = await comparePassword(dto.senha, user.senha);
    if (!isValid) {
        throw new ApiException(401, "Credenciais inválidas");
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "5d" }
    );

    const { id, senha, ...sanitizedUser } = user;

    return { token, user: { ...sanitizedUser } };
};