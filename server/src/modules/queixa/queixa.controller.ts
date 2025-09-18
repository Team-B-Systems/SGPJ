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

        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "Nenhum ficheiro enviado" });
        }

        if (file.mimetype !== "application/pdf") {
            return res
                .status(400)
                .json({ error: "Ficheiro inválido. Apenas PDF é permitido." });
        }

        const dto = {
            descricao: req.body.descricao,
            estado: req.body.estado,
            ficheiro: req.file!,
        };

        const id = parseInt(req.params.id, 10)
        const result = await queixaService.editar(id, dto);
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

export const baixarDocumento = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const queixaId = parseInt(req.params.id, 10);

        if (isNaN(queixaId)) {
            return res.status(400).json({ error: "ID da queixa inválido" });
        }

        const documento = await queixaService.baixarDocumento(queixaId);

        const buffer = Buffer.isBuffer(documento.ficheiro)
            ? documento.ficheiro
            : Buffer.from(documento.ficheiro as Uint8Array);

        res.setHeader('Content-Disposition', `attachment; filename=${new Date()}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader("Content-Length", buffer.length);

        return res.end(buffer);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao baixar documento:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
