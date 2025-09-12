import { EstadoComissao, PapelComissaoFuncionario } from "@prisma/client";

export interface comissaoDto{
    nome: string,
    dataCriacao: string,
    descricao: string,
    estado: EstadoComissao,
    dataEncerramento?: string,
    funcionario: number
    papel: PapelComissaoFuncionario
}