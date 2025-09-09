import { Router } from "express";
import { login, perfil, editarPerfil, cadastrarFuncionario, listarFuncionarios, pesquisarFuncionario } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/perfil", authMiddleware, perfil);
router.patch("/editarperfil", authMiddleware, editarPerfil);
router.post("/cadastrarfuncionario", authMiddleware, cadastrarFuncionario);
router.get("/visualizarfuncionarios", authMiddleware, listarFuncionarios);
router.post("/pesquisarfuncionario", authMiddleware, pesquisarFuncionario);

export default router;
