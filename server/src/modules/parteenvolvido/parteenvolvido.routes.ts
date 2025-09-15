import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as parteEnvolvidaController from "./parteenvolvido.controller";

const router = Router();

router.post("/add", authMiddleware, parteEnvolvidaController.adicionarParteEnvolvida);
router.get("/list/:processoId", authMiddleware, parteEnvolvidaController.listarPartesEnvolvidas);
router.delete("/remove/:processoId/:parteEnvolvidaId", authMiddleware, parteEnvolvidaController.removerParteEnvolvida);

export default router;
