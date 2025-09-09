import { Router } from "express";
import { editProfile, getProfile } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/perfil", authMiddleware, getProfile);
router.patch("/perfil", authMiddleware, editProfile);

export default router;