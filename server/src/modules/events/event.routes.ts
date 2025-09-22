import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as eventController from "./event.controller";

const router = Router();

router.get("/list", authMiddleware, eventController.listarEventos);
router.get("/list/user", authMiddleware, eventController.listarEventosUsuario);
router.delete("/delete/:id", authMiddleware, eventController.deletarEvento);

export default router;