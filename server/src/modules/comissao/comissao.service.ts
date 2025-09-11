import { PrismaClient } from "@prisma/client";
import { comissaoDto } from "./dto/criar.dto";
import ApiException from "../../common/Exceptions/api.exception";

const prisma = new PrismaClient()

export const criarComissao = async (dto: comissaoDto) => {
    const newComissao = await prisma.comissao.create({
        data: {
            nome: dto.nome,
            dataCriacao: dto.dataCriacao,
            descricao: dto.descricao,
            estado: dto.estado,
            funcionarios:
            {
                connect: { id: dto.funcionario }
            }
        }
    });

    await prisma.comissaoFuncionario.create({
        data: {
            comissaoId: newComissao.id,
            funcionarioId: dto.funcionario,
            papel: dto.papel

        }
    });

    const { ...sanitizedComissao } = newComissao
    return sanitizedComissao
};

export const editar = async (comissaoId: number, dto: comissaoDto) => {
    const comissao = await prisma.comissao.findUnique({
        where: { id: comissaoId }
    });

    if (!comissao) {
        throw new ApiException(404, "Comissão não encontrada");
    }

    if (comissao.estado === dto.estado) {
        throw new ApiException(400, `A comissão já se encontra no estado ${dto.estado}`);
    }

    const updateComissao = await prisma.comissao.update({
        where: { id: comissaoId },
        data: {
            estado: dto.estado
        },
    });

    const { id, ...sanitizedQueixa } = updateComissao
    return sanitizedQueixa;

};

export const visualizar = async () => {
    const queixas = await prisma.comissao.findMany({});

    if (!queixas) {
        throw new ApiException(404, "Comissão não encontradas");
    }
    return queixas;
};

export const pesquisarPorId = async (comissaoId: number) => {
    const queixa = await prisma.comissao.findUnique({
        where: { id: comissaoId }
    });

    if (!queixa) {
        throw new ApiException(404, "Comissão não encontrada");
    }

    const { id, ...sanitizedQueixa } = queixa
    return sanitizedQueixa;
};
