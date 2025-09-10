import { Request, Response } from "express";
import * as authService from "./auth.service";
import ApiException from "../../common/Exceptions/api.exception";

export const signup = async (req: Request, res: Response) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
};