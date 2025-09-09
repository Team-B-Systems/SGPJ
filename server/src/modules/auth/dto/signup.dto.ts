import { Role } from "@prisma/client";

export interface SignupDto {
    nome: string,
    numero_identificacao: string,
    email: string,
    senha: string,
    categoria: string,
    estado: boolean,
    role: Role
}