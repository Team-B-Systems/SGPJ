import { Request, Response } from "express";
import * as departamentoService from "./departamento.service";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "src/middlewares/auth.middleware";
import { Role } from "@prisma/client";


export const cadastrar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Admin) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const result = await departamentoService.cadastrarDepartamento(req.body);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

}