import { Request, Response } from "express";
import * as adminService from "./admin.service";
import * as authService from "../auth/auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import ApiException from "../../common/Exceptions/api.exception";


export const login = async (req: Request, res: Response) => {
    try {
        const result = await adminService.login(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};

export const perfil = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Admin) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const user = await adminService.perfil(req.user.userId);
        res.json(user);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

};

export const editarPerfil = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Admin) {
            res.status(401).json({ error: "Não autorizado" })
        }
        const user = await adminService.editarPerfil(req.user.userId, req.body);
        res.json(user);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};

export const cadastrarFuncionario = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Admin) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const user = await authService.signup(req.body);
        res.json(user);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};


export const listarFuncionarios = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autorizado" })
        }
        const users = await adminService.listarFuncionarios();
        res.json(users);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};

export const pesquisarFuncionario = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Admin) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const result = await adminService.pesquisarFuncionario(req.body.email);
        
        res.status(200).json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }

    }
};