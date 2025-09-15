import { Request, Response } from "express";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import * as parteEnvolvidaService from "./parteenvolvido.service";

export const adicionarParteEnvolvida = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    try {
        const dto = {
            processoId: parseInt(req.body.processoId, 10),
            nome: req.body.nome,
            numeroIdentificacao: req.body.numeroIdentificacao,
            papel: req.body.papel,
        };

        if (isNaN(dto.processoId)) {
            return res.status(400).json({ error: "ID do processo inválido" });
        }

        const response = await parteEnvolvidaService.adicionarParteEnvolvida(req.user.userId, dto);

        return res.status(200).json(response);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao adicionar parte envolvida:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export const listarPartesEnvolvidas = async (req: AuthRequest, res: Response) => {
    if (!req.user ||
        (req.user.role !== Role.Funcionário && req.user.role !== Role.Chefe)) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    const processoId = parseInt(req.params.processoId, 10);

    if (isNaN(processoId)) {
        return res.status(400).json({ error: "ID do processo inválido" });
    }

    try {
        const isChefe = req.user.role === Role.Chefe;
        const partesEnvolvidas = await parteEnvolvidaService.listarPartesEnvolvidas(req.user.userId, processoId, isChefe);

        return res.status(200).json(partesEnvolvidas);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao listar partes envolvidas:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export const removerParteEnvolvida = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    const processoId = parseInt(req.params.processoId, 10);
    const parteEnvolvidaId = parseInt(req.params.parteEnvolvidaId, 10);

    if (isNaN(processoId) || isNaN(parteEnvolvidaId)) {
        return res.status(400).json({ error: "ID do processo ou da parte envolvida inválido" });
    }

    try {
        const response = await parteEnvolvidaService.removerParteEnvolvida(req.user.userId, processoId, parteEnvolvidaId);

        return res.status(200).json(response);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao remover parte envolvida:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
