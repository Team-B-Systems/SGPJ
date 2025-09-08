import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../utils/hash";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

const prisma = new PrismaClient();

export const signup = async (dto: SignupDto) => {
    const existingUser = await prisma.admin.findUnique({
        where: { email: dto.email },
    });

    if (existingUser) {
        throw new Error("Email já está em uso");
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await prisma.admin.create({
        data: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
        },
    });

    const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    return {
        token,
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
    };
};

export const login = async (dto: LoginDto) => {
    const user = await prisma.admin.findUnique({
        where: { email: dto.email },
    });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    const isValid = await comparePassword(dto.password, user.password);
    if (!isValid) {
        throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    return { token, user: { id: user.id, email: user.email, name: user.name } };
};