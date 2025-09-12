import { Request, Response } from "express";
import { AuthRequest } from "src/middlewares/auth.middleware";
import * as   agendarReuniaoService from "./reuniao.service";
import ApiException from "../../common/Exceptions/api.exception";
import { Role, TipoDocumento } from "@prisma/client";
import * as anexarDocumento from "../documents/documents.service";

export const agendarReuniao = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const result = await agendarReuniaoService.agendarReuniao(req.body);
        res.status(201).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const visualizarReuniao = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const result = await agendarReuniaoService.visualizarReuniao();
        res.status(200).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const editarReuniao = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const id = parseInt(req.params.id, 10);

        const result = await agendarReuniaoService.editarEstadoReuniao(id, req.body);
        res.status(200).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const pesquisarReuniaoPorId = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const id = parseInt(req.params.id, 10);

        const result = await agendarReuniaoService.pesquisarReuniaoPorId(id);
        res.status(200).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const pesquisarReuniaoPorEstado = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const result = await agendarReuniaoService.pesquisarReuniaoPorEstado(req.body);
        res.status(200).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const pesquisarReuniaoPorIdComissao = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const id = parseInt(req.params.idCom, 10);

        const result = await agendarReuniaoService.pesquisarReuniaoPorIdComissao(id);
        res.status(200).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const pesquisarReuniaoPorIdProcesso = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
        const id = parseInt(req.params.idProc, 10);

        const result = await agendarReuniaoService.pesquisarReuniaoPorIdProcesso(id);
        res.status(200).json(result)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const anexarDocument = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== Role.Funcionário) {
        return res.status(401).json({ error: "Não autorizado" })
    }

    try {
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

        if (dto.tipoDocumento !== TipoDocumento.Ata){
             return res.status(400).json({ error: "O documento a anexar deve ser do tipo Ata" });
        }

        const documento = await anexarDocumento.anexarDocumento(req.user.userId, dto);

        const anexar = await agendarReuniaoService.anexar(documento.documento.id, req.body);
        res.status(200).json(anexar)
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

}