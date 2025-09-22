import { Router } from "express";
import { login, signup, changePassword, generate2FASecret, verify2FA } from "./auth.controller";
import { authMiddleware } from "../..//middlewares/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/change-password", authMiddleware, changePassword);

router.post("/2fa/generate/", authMiddleware, generate2FASecret);
router.post("/2fa/verify/", verify2FA);

export default router;