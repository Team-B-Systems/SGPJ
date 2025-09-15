import { EnvolvidoPapelNoProcesso } from "@prisma/client";

export interface AdicionarDTO {
    processoId: number;
    nome: string;
    numeroIdentificacao: string;
    papel: EnvolvidoPapelNoProcesso;
}
