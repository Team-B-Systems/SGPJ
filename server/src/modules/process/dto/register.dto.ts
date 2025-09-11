import { TipoDeProcesso } from "@prisma/client";

export interface RegisterDTO {
    assunto: string;
    tipo: TipoDeProcesso;
}