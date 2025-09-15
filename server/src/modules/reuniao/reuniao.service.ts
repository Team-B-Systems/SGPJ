import { EstadoComissao, EstadoProcesso, EstadoReuniao, PrismaClient, TipoDocumento } from "@prisma/client";
import { reuniaoDto } from "./dto/criar.dto";
import ApiException from "../../common/Exceptions/api.exception";
import { editarReuniaoDto } from "./dto/editar.dto";
import { anexarDto } from "./dto/anexar.dto";

const prisma = new PrismaClient()

export const agendarReuniao = async (dto: reuniaoDto) => {
    const dataReuniao = new Date(dto.dataHora);
    const agora = new Date();

    dataReuniao.setHours(0, 0, 0, 0);
    agora.setHours(0, 0, 0, 0);

    if (dataReuniao < agora) {
        throw new ApiException(400, "A data da reunião deve ser maior ou igual à data atual.");
    }

    const processo = await prisma.processoJuridico.findFirst({
        where: { id: dto.processoId }
    });

    if (!processo) {
        throw new ApiException(404, "Processo não encontrado");
    }

    if (processo.estado !== EstadoProcesso.Aberto) {
        throw new ApiException(400, `Não é permitido marcar reunião em processo com estado ${processo.estado}`);
    }

    const comissao = await prisma.comissao.findFirst({
        where: { id: dto.comissaoId }
    });

    if (!comissao) {
        throw new ApiException(404, "Processo não encontrado");
    }

    if (comissao.estado !== EstadoComissao.Aprovada) {
        throw new ApiException(400, `Não é permitido marcar reunião em comissão com estado ${comissao.estado}`);
    }

    const newReuniao = await prisma.reuniao.create({
        data: {
            dataHora: dto.dataHora,
            local: dto.local,
            processoId: dto.processoId,
            comissaoId: dto.comissaoId,
            estado: dto.estado
        }
    });

    return newReuniao;
};

export const pesquisarReuniaoPorId = async (idReuniao: number) => {
    const reuniao = await prisma.reuniao.findFirst({
        where: { id: idReuniao }
    });

    if (!reuniao) {
        throw new ApiException(404, "Reunião não encontrada");
    }

    return reuniao;
}

export const pesquisarReuniaoPorIdProcesso = async (idProcesso: number) => {
    const reuniao = await prisma.reuniao.findMany({
        where: { processoId: idProcesso }
    });

    if (reuniao.length === 0) {
        throw new ApiException(404, "Reunião não encontrada");
    }

    return reuniao;
}

export const pesquisarReuniaoPorIdComissao = async (idComissao: number) => {
    const reuniao = await prisma.reuniao.findMany({
        where: { comissaoId: idComissao }
    });

    if (reuniao.length === 0) {
        throw new ApiException(404, "Reunião não encontrada");
    }

    return reuniao;
}

export const pesquisarReuniaoPorEstado = async (estado: EstadoReuniao) => {
    const reuniao = await prisma.reuniao.findMany({
        where: { estado: estado }
    });

    if (reuniao.length === 0) {
        throw new ApiException(404, "Reunião não encontrada");
    }

    return reuniao;
}

export const visualizarReuniao = async () => {
    return await prisma.reuniao.findMany();
}

export const anexar = async (documentId: number, dto: anexarDto) => {
    const reuniao = await prisma.reuniao.findFirst({
        where: { id: parseInt(dto.id.toString(), 10) }
    });

    if (!reuniao) {
        throw new ApiException(404, "Reunião não encontrada");
    }

    if (reuniao.estado !== EstadoReuniao.Concluida && dto.tipoDocumento == TipoDocumento.Ata) {
        throw new ApiException(400, "Não pode anexar ata em uma reunião que não foi concluida");
    }

    const updateReuniao = await prisma.reuniao.update({
        where: { id: parseInt(dto.id.toString(), 10) },
        data: {
            documentoId: documentId
        }
    });

    return updateReuniao;

}

export const editarEstadoReuniao = async (idReuniao: number, dto: editarReuniaoDto) => {
    const reuniao = await pesquisarReuniaoPorId(idReuniao);

    if (reuniao.estado === EstadoReuniao.Cancelada) {
        throw new ApiException(400, "Não é permitido alterar o estado da reunião que já se encontra cancelada");
    }

    if (reuniao.estado === EstadoReuniao.EmAndamento && (dto.estado === EstadoReuniao.Cancelada
        || dto.estado === EstadoReuniao.EmAndamento || dto.estado === EstadoReuniao.Agendada)) {
        throw new ApiException(400, "Reunião já está em andamento");
    }

    if (reuniao.estado === EstadoReuniao.Concluida && (dto.estado !== EstadoReuniao.Concluida
        || dto.estado === EstadoReuniao.Concluida)) {
        throw new ApiException(400, "Reunião já está concluída");
    }

    if (reuniao.estado === EstadoReuniao.Agendada && dto.estado !== EstadoReuniao.Concluida
        && dto.estado !== EstadoReuniao.Cancelada) {
        await atualizaEstado(idReuniao, EstadoReuniao.EmAndamento);
        return { message: "Estado da reunião atualizado" }
    }

    if ((reuniao.estado === EstadoReuniao.EmAndamento) && dto.estado !== EstadoReuniao.EmAndamento
        && dto.estado !== EstadoReuniao.Cancelada && dto.estado !== EstadoReuniao.Agendada) {
        await atualizaEstado(idReuniao, EstadoReuniao.Concluida);
        return { message: "Estado da reunião atualizado" }
    }
}

export const remarcarReuniao = async (idReuniao: number, dto: editarReuniaoDto) => {
    const reuniao = await pesquisarReuniaoPorId(idReuniao);
    const dataReuniao = new Date(dto.data);
    const agora = new Date();
    dataReuniao.setHours(0, 0, 0, 0);
    agora.setHours(0, 0, 0, 0);

    if (reuniao.estado === EstadoReuniao.Cancelada) {
        throw new ApiException(400, "Não é permitido remarcar a reunião que já se encontra cancelada");
    }

    if (reuniao.estado === EstadoReuniao.EmAndamento) {
        throw new ApiException(400, "Não é permitido remarcar a reunião que já está em andamento");
    }

    if (reuniao.estado === EstadoReuniao.Concluida) {
        throw new ApiException(400, "Não é permitido remarcar a reunião que está concluída");
    }

    if (dataReuniao < agora) {
        throw new ApiException(400, "A data da reunião deve ser maior ou igual à data atual.");
    }

    if (reuniao.dataHora.setHours(0, 0, 0, 0) > dataReuniao.getTime()) {
        throw new ApiException(400, "A nova data não pode ser menor que a data atual da reunião.");
    }

    return await prisma.reuniao.update({
        where: { id: idReuniao },
        data: {
            dataHora: dto.data,
            local: dto.local
        }
    });
}

async function atualizaEstado(idReuniao: number, estado: EstadoReuniao) {
    return await prisma.reuniao.update({
        where: { id: idReuniao },
        data: {
            estado: estado
        }
    });
}