import { NomeDepartamento } from "@prisma/client";

export interface DepartamentoDto {
    nome: NomeDepartamento,
    descricao: string,
}