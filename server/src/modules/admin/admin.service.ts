import { PrismaClient, Role } from "@prisma/client";
import { LoginDto } from "./dto/login.dto";
import { comparePassword } from "../../utils/hash";
import jwt from "jsonwebtoken";
import { EditDto } from "./dto/edit.dto";
import ApiException from "../../common/Exceptions/api.exception";

const prisma = new PrismaClient();

export const login = async (dto: LoginDto) => {
    const user = await prisma.funcionario.findUnique({
        where: { email: dto.email, role: Role.Admin }
    })

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
    )

    const { id, senha, ...sanitizedUser } = user;

    return { token, user: { ...sanitizedUser } };
};

export const perfil = async (userId: number) => {
    const user = await prisma.funcionario.findUnique({
        where: { id: userId }
    })

    if (!user) {
        throw new ApiException(404, "Utilizador não encontrado");
    }

    return user;
};

export const editarPerfil = async (userId: number, dto: EditDto) => {

    const user = await prisma.funcionario.findUnique({
        where: { email: dto.email }
    });

    if (!user) {
        throw new ApiException(404, "Utilizador não encontrado");
    }

    const updateUser = await prisma.funcionario.update({
        where: { email: dto.email },
        data: {
            nome: dto.nome,
            estado: dto.estado,
        },
    });

    return updateUser;

};

export const listarFuncionarios = async () => {
    const users = await prisma.funcionario.findMany({
        where: { role: { not: Role.Admin } },
        include: { departamento: true }
    });

    if (!users) {
        throw new ApiException(404, "Utilizadores não encontrados");
    }

    
    return users.map((user) => {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            nome: user.nome,
            numeroIdentificacao: user.numeroIdentificacao,
            categoria: user.categoria,
            estado: user.estado,
            departamento: user.departamento.nome
        }
    });
};

export const pesquisarFuncionario = async (email: string) => {
    const user = await prisma.funcionario.findUnique({
        where: { email: email, role: { not: Role.Admin } }
    });

    if (!user) {
        throw new ApiException(404, "Utilizador não encontrado");
    }

    return user;
}