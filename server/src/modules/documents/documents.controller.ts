import { Request, Response } from "express";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";
import * as documentService from "./documents.service";
import fs from "fs";

export const anexarDocumento = async (req: AuthRequest, res: Response) => {
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
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            tipoDocumento: req.body.tipoDocumento,
            processoId: parseInt(req.body.processoId, 10),
            ficheiro: req.file!,
        };

        const response = await documentService.anexarDocumento(req.user.userId, dto);

        return res.status(200).json(response);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao anexar documento:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const listarDocumentosPorProcesso = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const processoId = parseInt(req.params.processoId, 10);
        
        if (isNaN(processoId)) {
            return res.status(400).json({ error: "ID do processo inválido" });
        }

        const documentos = await documentService.listarDocumentosPorProcesso(processoId, parseInt(req.user.userId, 10));

        return res.status(200).json(documentos);
    } catch (error) {
        if (error instanceof ApiException) {
            return res.status(error.status).json({ error: error.message });
        }

        console.error("Erro ao listar documentos:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export const baixarDocumento = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user || req.user.role !== Role.Funcionário) {
            return res.status(401).json({ error: "Não autorizado" })
        }

        const documentoId = parseInt(req.params.id, 10);

        if (isNaN(documentoId)) {
            return res.status(400).json({ error: "ID do documento inválido" });
        }

        const documento = await documentService.baixarDocumento(documentoId, req.user.userId);

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
