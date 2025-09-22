import { PrismaClient, EventoSistema, TipoEvento } from "@prisma/client";
import ApiException from "../../common/Exceptions/api.exception";
import { LogEventDTO } from "./dto/log-event.dto";

const prisma = new PrismaClient();

export const listAllEvents = async (limit: number, offset: number): Promise<EventoSistema[]> => {
    return prisma.eventoSistema.findMany({
        take: limit,
        skip: offset,
        orderBy: {
            createdAt: 'desc'
        },
    });
}

export const listAllUserEvents = async (userId: number, limit: number, offset: number): Promise<EventoSistema[]> => {
    return prisma.eventoSistema.findMany({
        where: {
            funcionarioId: userId
        },
        take: limit,
        skip: offset,
        orderBy: {
            createdAt: 'desc'
        },
    });
}

export const logEvent = async (dto: LogEventDTO): Promise<EventoSistema> => {
    // Validate tipoEvento
    if (!Object.values(TipoEvento).includes(dto.tipoEvento)) {
        throw new ApiException(400, "Tipo de evento inválido");
    }

    return prisma.eventoSistema.create({
        data: {
            funcionarioId: dto.funcionarioId,
            entidade: dto.entidade,
            entidadeId: dto.entidadeId,
            tipoEvento: dto.tipoEvento,
            descricao: dto.descricao,
        },
    });
}

export const deleteEvent = async (id: number): Promise<EventoSistema> => {
    return prisma.$transaction(async (tx) => {
        const event = await tx.eventoSistema.findUnique({
            where: { id }
        });
        
        if (!event) {
            throw new ApiException(404, "Evento não encontrado");
        }

        await tx.eventoSistema.delete({
            where: { id }
        });

        // Log the deletion event
        await tx.eventoSistema.create({
            data: {
                funcionarioId: event.funcionarioId,
                entidade: 'EventoSistema',
                entidadeId: event.id,
                tipoEvento: TipoEvento.DELETE,
                descricao: `Evento ID ${event.id} deletado`,
            },
        });

        return event;
    });
}
