import { TipoDocumento } from "@prisma/client";

export interface AttachDocumentDTO {
    titulo: string;
    descricao: string;
    tipoDocumento: TipoDocumento;
    ficheiro: Express.Multer.File;
    processoId: number;
}
