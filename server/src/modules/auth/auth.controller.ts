import { Request, Response } from "express";
import * as authService from "./auth.service";
import ApiException from "../../common/Exceptions/api.exception";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const signup = async (req: Request, res: Response) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);

        // 👇 Se o user tem 2FA ativo, não retorna o token final ainda

        // Caso contrário, login normal
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Não autorizado" });
        }

        const result = await authService.changePassword(
            req.user.userId,
            req.body.oldPassword,
            req.body.newPassword
        );

        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res
                .status(500)
                .json({ error: `Erro interno no servidor: ${err.message}` });
        }
    }
};

export const generate2FASecret = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: "Não autorizado" });
    }

    try {
        const result = await authService.generate2FASecret(req.user.userId);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// 👇 Aqui muda: recebe tempToken + código do frontend
export const verify2FA = async (req: Request, res: Response) => {
    try {
        const { tempToken, code } = req.body;

        if (!tempToken || !code) {
            return res.status(400).json({ error: "Token temporário ou código ausente" });
        }

        const result = await authService.verify2FA(tempToken, code);
        res.json(result); // aqui já devolve o token final
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Erro interno no servidor: ${err.message}` });
        }
    }
};