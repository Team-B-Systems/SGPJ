import { EstadoQueixa } from "@prisma/client";

export interface EditarQueixaDto{
    descricao?: string,
    estado?: EstadoQueixa,
    assuntoProcesso?: string,
    ficheiro?: Express.Multer.File,
}