import { EstadoComissao, PapelComissaoFuncionario } from "@prisma/client";

export interface comissaoDto {
    nome: string,
    dataCriacao: string,
    descricao: string,
    estado: EstadoComissao,
    dataEncerramento?: string,
    processoId?: number,
    funcionarios: {
        funcionarioId: number;
        papel: PapelComissaoFuncionario;
    }[]
}