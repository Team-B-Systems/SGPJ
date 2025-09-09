import { PrismaClient, Role } from "@prisma/client";
import { LoginDto } from "./dto/login.dto";
import { comparePassword, hashPassword } from "../../utils/hash";
import jwt from "jsonwebtoken";
import { EditDto } from "./dto/edit.dto";

const prisma = new PrismaClient();

export const login = async (dto: LoginDto) => {
    const user = await prisma.funcionario.findUnique({
        where: { email: dto.email, role: Role.Admin }
    })

    if (!user) {
        throw new Error("Admin não encontrado");
    }

    const isValid = await comparePassword(dto.senha, user.senha);
    if (!isValid) {
        throw new Error("Credenciais inválidas")
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "5d" }
    )

    return { token, user: { id: user.id, email: user.email, nome: user.nome } }
};

export const perfil = async (userId: number) => {
    const user = await prisma.funcionario.findUnique({
        where: { id: userId }
    })

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    return user;
};

export const editarPerfil = async(userId: number, dto:EditDto)=>{

    const user = await prisma.funcionario.findUnique({
        where: {id: userId}
    });

    if (!user){
        throw new Error("Usário não encontrado");
    }

    const updateUser = await prisma.funcionario.update({
        where: {id: userId},
        data: {
            nome: dto.nome ?? user.nome
        },
    });

    return updateUser;

};