import { Request, Response } from "express";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import * as eventsService from "./events.service";

export const listarEventos = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Admin) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;

    try {
        const eventos = await eventsService.listAllEvents(limit, offset);
        return res.status(200).json(eventos);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao listar eventos:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export const listarEventosUsuario = async (req: AuthRequest, res: Response) => {
    if (!req.user ||
        (req.user.role !== Role.Funcionário && req.user.role !== Role.Chefe)) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;

    try {
        const eventos = await eventsService.listAllUserEvents(req.user.userId, limit, offset);
        return res.status(200).json(eventos);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao listar eventos do usuário:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export const deletarEvento = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Chefe) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    const eventId = parseInt(req.params.id, 10);

    if (isNaN(eventId)) {
        return res.status(400).json({ error: "ID do evento inválido" });
    }

    try {
        const deletedEvent = await eventsService.deleteEvent(eventId);
        return res.status(200).json(deletedEvent);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao deletar evento:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
