import { PrismaClient } from "@prisma/client";
import { QueixaDto } from "./dto/registar.dto";
import ApiException from "../../common/Exceptions/api.exception";

const prisma = new PrismaClient()

export const cadastrarQueixa = async (dto: QueixaDto) => {
    const newQueixa = await prisma.queixa.create({
        data: {
            dataEntrada: dto.dataEntrada,
            descricao: dto.descricao,
            estado: dto.estado,
            ficheiro: dto.ficheiro?.buffer ?? undefined,
            processoId: dto.processoId ?? undefined,
            pPassivaId: dto.pPassivaId,
            funcionarioId: dto.funcionarioId
        }
    });

    await prisma.queixaDepartamento.create({
        data: {
            queixaId: newQueixa.id,
            departamentoId: dto.departamento

        }
    });

    const { id, ...sanitizedQueixa } = newQueixa
    return sanitizedQueixa
};

export const editar = async (queixaId: number, dto: QueixaDto) => {
    const queixa = await prisma.queixa.findUnique({
        where: { id: queixaId }
    });

    if (!queixa) {
        throw new ApiException(404, "Queixa não encontrada");
    }

    const updateQueixa = await prisma.queixa.update({
        where: { id: queixaId },
        data: {
            estado: dto.estado,
            descricao: dto.descricao
        },
    });

    const { id, ...sanitizedQueixa } = updateQueixa
    return sanitizedQueixa;

};

export const visualizar = async () => {
    const queixas = await prisma.queixa.findMany({});

    if (!queixas) {
        throw new ApiException(404, "Queixas não encontradas");
    }
    return queixas;
};

export const pesquisarPorId = async (queixaId: number) => {
    const queixa = await prisma.queixa.findUnique({
        where: { id: queixaId }
    });

    if (!queixa) {
        throw new ApiException(404, "Queixa não encontrada");
    }
    const { id, ...sanitizedQueixa } = queixa
    return sanitizedQueixa;
};
