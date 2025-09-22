import { EstadoFuncionario, NomeDepartamento } from "@prisma/client"

export interface EditDto{
    nome?: string
    email: string
    estado?: EstadoFuncionario
    departamento?: NomeDepartamento
}