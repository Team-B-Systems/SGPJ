import { Request, Response } from "express";
import * as comissaoService from "./comissao.service";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";


export const cadastrar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Chefe) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const result = await comissaoService.criarComissao(req.body);
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
        if (!req.user || req.user.role !== Role.Chefe) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const id = parseInt(req.params.id, 10)
        const result = await comissaoService.editar(id, req.body);
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
        if (!req.user) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const result = await comissaoService.visualizar();
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
        if (!req.user || req.user.role !== Role.Chefe) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const id = parseInt(req.params.id, 10)
        const result = await comissaoService.pesquisarPorId(id);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};


export const adicionarMembro = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Chefe) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const id = parseInt(req.params.id, 10)
        const result = await comissaoService.adicionarMembro(id, req.body);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};