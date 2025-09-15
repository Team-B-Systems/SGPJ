import { TipoDocumento } from "@prisma/client";

export interface anexarDto{
    id: number,
    titulo: string,
    descricao: string,
    tipoDocumento: TipoDocumento,
    ficheiro: Express.Multer.File,
    processoId: number
}