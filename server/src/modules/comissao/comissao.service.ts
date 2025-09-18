import { EstadoComissao, PrismaClient } from "@prisma/client";
import { comissaoDto } from "./dto/criar.dto";
import ApiException from "../../common/Exceptions/api.exception";
import { adicionarMembroDto } from "./dto/adicionar.dto";

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
    const comissoes = await prisma.comissao.findMany({
        include: {
            funcionarios: true,
        },
    });

    if (!comissoes) {
        throw new ApiException(404, "Comissões não encontradas");
    }
    return comissoes.map((comissao) => {
        return {
            id: comissao.id,
            nome: comissao.nome,
            descricao: comissao.descricao,
            estado: comissao.estado,
            dataEncerramento: comissao.dataEncerramento,
            funcionarios: comissao.funcionarios,
        }
    })
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

export const adicionarMembro = async (comissaoId: number, dto: adicionarMembroDto) => {
    const funcionario = await prisma.funcionario.findFirst({
        where: { email: dto.email }
    })

    if (!funcionario) {
        throw new ApiException(404, "O funcionário não encontrado");
    }

    const comissaoMembro = await prisma.comissaoFuncionario.findFirst({
        where: {
            comissaoId: comissaoId, funcionarioId: funcionario.id
        }
    });

    if (comissaoMembro) {
        throw new ApiException(400, "O membro já faz parte desta comissão");
    }

    const comissao = await prisma.comissao.findUnique({
        where: { id: comissaoId }
    })

    if (!comissao) {
        throw new ApiException(404, "")
    }

    if (comissao.estado !== EstadoComissao.Aprovada) {
        throw new ApiException(400, "O membro não pode fazer parte de uma comissão dispensada");
    }

    const addMembro = await prisma.comissaoFuncionario.create({
        data: {
            comissaoId: comissao.id,
            funcionarioId: funcionario.id,
            papel: dto.papel
        }
    });

    return addMembro;
};
