import { EstadoFuncionario } from "@prisma/client"

export interface EditDto{
    nome?: string
    email: string
    estado?: EstadoFuncionario
}