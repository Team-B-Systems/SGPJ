import { Request, Response } from "express";
import * as authService from "./auth.service";

export const signup = async (req: Request, res: Response) => {
    try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};