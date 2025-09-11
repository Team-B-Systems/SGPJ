import { EstadoQueixa } from "@prisma/client";

export interface QueixaDto{
    dataEntrada: string,
    descricao: string,
    estado: EstadoQueixa,
    ficheiro: Express.Multer.File ,
    processoId?: number,
    pPassivaId: number,
    departamento: number,
    funcionarioId: number

}