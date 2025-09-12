import { TipoDeProcesso, EstadoProcesso } from '@prisma/client';

export interface EditDTO {
    assunto?: string;
    estado?: EstadoProcesso;
    tipoProcesso?: TipoDeProcesso;
    dataEncerramento?: Date;
}