import { PrismaClient, Role } from "@prisma/client";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../utils/hash";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

const prisma = new PrismaClient();

export const signup = async (dto: SignupDto) => {
    const existingUser = await prisma.funcionario.findUnique({
            where: { email: dto.email },
        });
    
        if (existingUser){
             throw new Error("Email já está em uso");
        }
    
        const hashedsenha = await hashPassword(dto.senha);
    
        const newUser = await prisma.funcionario.create({
            data: {
                nome: dto.nome,
                numero_identificacao: dto.numero_identificacao,
                email: dto.email,
                categoria: dto.categoria,
                senha: hashedsenha,
                estado: dto.estado,
                role: dto.role
            }
        });
  
        const { id, ...sanitizedUser } = newUser;
    
        return sanitizedUser;
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
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "5d" }
    );

    const { id, ...sanitizedUser } = user;

    return { token, user: { ...sanitizedUser } };
};