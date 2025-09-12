import { PapelComissaoFuncionario } from "@prisma/client";

export interface adicionarMembroDto {
    email: string,
    papel: PapelComissaoFuncionario
}