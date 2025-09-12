import { EstadoReuniao } from "@prisma/client";

export interface reuniaoDto{
    dataHora: string,
    local: string,
    estado: EstadoReuniao,
    processoId: number,
    comissaoId: number
}