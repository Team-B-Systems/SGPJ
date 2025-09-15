import { EstadoReuniao } from "@prisma/client";

export interface editarReuniaoDto{
    idReuniao: number,
    estado: EstadoReuniao,
    data: string,
    local: string,
}