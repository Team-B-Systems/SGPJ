import { CategoriaFuncionario, EstadoFuncionario, NomeDepartamento, Role } from "@prisma/client";

export interface SignupDto {
    nome: string,
    numero_identificacao: string,
    email: string,
    senha: string,
    categoria: CategoriaFuncionario,
    estado: EstadoFuncionario,
    role: Role,
    nomeDepartamento: NomeDepartamento,
}