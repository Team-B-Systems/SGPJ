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
        }
    });

    await Promise.all(dto.funcionarios.map(m =>
        prisma.comissaoFuncionario.create({
            data: {
                comissaoId: newComissao.id,
                funcionarioId: m.funcionarioId,
                papel: m.papel
            }
        })
    ));

    const updateProcess = await prisma.processoJuridico.update({
        where: { id: dto.processoId },
        data: { comissaoId: newComissao.id }
    });

    if (!updateProcess) {
        throw new ApiException(404, "Processo não encontrado");
    }

    const { ...sanitizedComissao } = newComissao
    return sanitizedComissao
};

export const editar = async (comissaoId: number, dto: comissaoDto) => {
    const comissao = await prisma.comissao.findUnique({
        where: { id: comissaoId },
        include: { funcionarios: true }
    });

    if (!comissao) {
        throw new ApiException(404, "Comissão não encontrada");
    }

    if (comissao.dataEncerramento) {
        throw new ApiException(400, "A comissão já se encontra Encerrada");
    }
    // Validações de estado
    if (comissao.estado === EstadoComissao.Pendente && dto.estado === EstadoComissao.Dispensada) {
        throw new ApiException(400, "A comissão já se encontra pendente");
    }

    if (comissao.estado === EstadoComissao.Rejeitada && dto.estado !== EstadoComissao.Rejeitada) {
        throw new ApiException(400, "A comissão já se encontra rejeitada");
    }

    // if (comissao.estado === EstadoComissao.Aprovada && dto.estado !== EstadoComissao.Dispensada) {
    //     throw new ApiException(400, "A comissão já foi aprovada");
    // }

    if (comissao.estado === EstadoComissao.Dispensada) {
        throw new ApiException(400, "A comissão já se encontra dispensada");
    }

    // Atualiza dados da comissão
    const updatedComissao = await prisma.comissao.update({
        where: { id: comissaoId },
        data: {
            nome: dto.nome,
            descricao: dto.descricao,
            dataCriacao: new Date(dto.dataCriacao),
            dataEncerramento: dto.dataEncerramento ? new Date(dto.dataEncerramento) : null,
            estado: dto.estado
        }
    });

    // Se vierem novos membros, substitui os antigos
    if (dto.funcionarios && dto.funcionarios.length > 0) {
        await prisma.comissaoFuncionario.deleteMany({
            where: { comissaoId }
        });

        await Promise.all(dto.funcionarios.map(m =>
            prisma.comissaoFuncionario.create({
                data: {
                    comissaoId,
                    funcionarioId: m.funcionarioId,
                    papel: m.papel
                }
            })
        ));
    }

    const { id, ...sanitized } = updatedComissao;
    return sanitized;
};


export const visualizar = async () => {
    const comissoes = await prisma.comissao.findMany({
        include: {
            processos: true,
            funcionarios: {
                include: {
                    funcionario: true
                }
            }
        }
    });

    if (!comissoes) {
        throw new ApiException(404, "Comissões não encontradas");
    }
    return comissoes;
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
    });

    if (!funcionario) {
        throw new ApiException(404, "Funcionário não encontrado");
    }

    const comissao = await prisma.comissao.findUnique({
        where: { id: comissaoId }
    });

    if (!comissao) {
        throw new ApiException(404, "Comissão não encontrada");
    }

    if (comissao.estado !== EstadoComissao.Aprovada) {
        throw new ApiException(400, "Apenas comissões aprovadas podem ter novos membros");
    }

    const comissaoMembroExistente = await prisma.comissaoFuncionario.findFirst({
        where: {
            comissaoId,
            funcionarioId: funcionario.id
        }
    });

    if (comissaoMembroExistente) {
        throw new ApiException(400, "Este funcionário já faz parte da comissão");
    }

    if (dto.papel === 'Presidente') {
        const presidenteExistente = await prisma.comissaoFuncionario.findFirst({
            where: {
                comissaoId,
                papel: 'Presidente'
            }
        });

        if (presidenteExistente) {
            throw new ApiException(400, "Esta comissão já possui um presidente");
        }
    }

    const novoMembro = await prisma.comissaoFuncionario.create({
        data: {
            comissaoId,
            funcionarioId: funcionario.id,
            papel: dto.papel
        }
    });

    return novoMembro;
};
