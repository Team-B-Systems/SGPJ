import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        res.json({ user });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export const editProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const dto = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Utilizador não autenticado" });
        }
        const updatedUser = await editProfile(userId, dto);
        res.json({ user: updatedUser });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}
