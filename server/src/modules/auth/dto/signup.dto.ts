import { CategoriaFuncionario, EstadoFuncionario, NomeDepartamento, Role } from "@prisma/client";

export interface SignupDto {
    nome: string,
    numeroIdentificacao: string,
    email: string,
    senha: string,
    categoria: CategoriaFuncionario,
    estado: EstadoFuncionario,
    role: Role,
    departamento: NomeDepartamento,
}