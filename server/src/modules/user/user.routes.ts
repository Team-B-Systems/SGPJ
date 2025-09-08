import { Router, Response } from "express";
import { AuthRequest, authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/profile", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Perfil do utilizador",
    user: req.user,
  });
});

export default router