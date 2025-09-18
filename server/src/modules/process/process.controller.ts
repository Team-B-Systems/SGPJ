import { Request, Response } from "express";
import * as processService from "./process.service";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "src/middlewares/auth.middleware";
import { Role } from "@prisma/client";

export const registerProcess = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const newProcess = await processService.registerProcess(req.user.userId, req.body);

        res.status(201).json(newProcess);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const editProcess = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    const processId = parseInt(req.params.id, 10);

    try {
        const updatedProcess = await processService.editProcess(req.user.userId, processId, req.body);
        res.status(200).json(updatedProcess);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

// Controllers for Get Process by ID, Get Process by "numeroProcesso" and List Processes with pagination and filtering

export const getProcessById = async (req: AuthRequest, res: Response) => {
    if (!req.user ||
        (req.user.role !== Role.Funcionário && req.user.role !== Role.Chefe)) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    const processId = parseInt(req.params.id, 10);

    try {
        const process = await processService.getProcessById(processId);

        res.status(200).json(process);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const getProcessByNumber = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    const processNumber = req.params.numeroProcesso;

    try {
        const process = await processService.getProcessByNumber(req.user.userId, processNumber);
        res.status(200).json(process);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const listProcesses = async (req: AuthRequest, res: Response) => {
    if (!req.user || (req.user.role !== Role.Funcionário && req.user.role !== Role.Chefe)) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    const isChefe = req.user.role === Role.Chefe;

    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const filter: any = {};

    if (req.query.estado) {
        filter.estado = req.query.estado;
    }

    if (req.query.tipoProcesso) {
        filter.tipoProcesso = req.query.tipoProcesso;
    }

    try {
        const processes = await processService.listProcesses(req.user.userId, isChefe, page, pageSize, filter);
        res.status(200).json(processes);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const archiveProcess = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    const processId = parseInt(req.params.id, 10);

    try {
        const result = await processService.archiveProcess(req.user.userId, processId, req.body);

        res.status(200).json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}
