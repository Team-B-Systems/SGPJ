import { PrismaClient } from "@prisma/client";
import { partePassivaDto } from "./dto/registar.dto";

const prisma = new PrismaClient()

export const cadastrar = async (dto: partePassivaDto) => {
    const newPartePassiva = await prisma.partePassiva.create({
        data: {
            nome: dto.nome,
        }
    });

    await prisma.funcionarioPartePassiva.create({
        data:{
            partePassivaId: newPartePassiva.id,
            funcionarioId: dto.funcionario,
        }
    });

    return newPartePassiva
};