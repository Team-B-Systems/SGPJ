import { EstadoQueixa } from "@prisma/client";

export interface EditarQueixaDto{
    descricao?: string,
    estado?: EstadoQueixa,
    ficheiro?: Express.Multer.File ,
}