import { Response } from "express";
import * as userService from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import ApiException from "../../common/Exceptions/api.exception";

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(401).json({ error: "Utilizador não autenticado" });
        }

        const user = await userService.getProfile(userId);
        
        res.status(200).json(user);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}

export const editProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const dto = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Utilizador não autenticado" });
        }
        const updatedUser = await userService.editProfile(userId, dto);
        res.json({ user: updatedUser });
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }
}
