import { Request, Response } from "express";
import * as queixaService from "./queixa.service";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";


export const cadastrar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const result = await queixaService.cadastrarQueixa(req.body);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

};

export const editar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const id = parseInt(req.params.id, 10)
        const result = await queixaService.editar(id, req.body);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

};

export const visualizar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const result = await queixaService.visualizar();
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

};

export const pesquisar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const id = parseInt(req.params.id, 10)
        const result = await queixaService.pesquisarPorId(id);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};