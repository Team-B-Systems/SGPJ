import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../utils/hash";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

const prisma = new PrismaClient();

export const signup = async (dto: SignupDto) => {
    const existingUser = await prisma.funcionario.findUnique({
        where: { email: dto.email },
    });

    if (existingUser) {
        throw new Error("Email já está em uso");
    }

    const hashedPassword = await hashPassword(dto.senha);

    const newUser = await prisma.funcionario.create({
        data: {
            email: dto.email,
            numero_identificacao: dto.numero_identificacao,
            senha: hashedPassword,
            nome: dto.nome,
            categoria: dto.categoria,
            estado: false,
        },
    });

    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    const { id, ...sanitizedUser } = newUser;

    return {
        token,
        user: { ...sanitizedUser },
    };
};

export const login = async (dto: LoginDto) => {
    const user = await prisma.funcionario.findUnique({
        where: { email: dto.email },
    });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    const isValid = await comparePassword(dto.senha, user.senha);
    if (!isValid) {
        throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    const { id, ...sanitizedUser } = user;

    return { token, user: { ...sanitizedUser } };
};