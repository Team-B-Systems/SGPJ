import { TipoEvento } from "@prisma/client";

export interface LogEventDTO {
    funcionarioId: number;
    entidade: string;
    entidadeId: number;
    tipoEvento: TipoEvento;
    descricao: string;
}