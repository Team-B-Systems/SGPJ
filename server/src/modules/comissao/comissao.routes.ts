import { Router } from "express";
import { cadastrar, editar, visualizar, pesquisar, adicionarMembro } from "./comissao.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/cadastrar", authMiddleware, cadastrar);
router.patch("/editar/:id", authMiddleware, editar);
router.get("/visualizar", authMiddleware, visualizar);
router.post("/pesquisar/:id", authMiddleware, pesquisar);
router.post("/adicionar/:id", authMiddleware, adicionarMembro);
export default router;
