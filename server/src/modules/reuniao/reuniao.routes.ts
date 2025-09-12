import { Router } from "express";
import {
    agendarReuniao, editarReuniao, visualizarReuniao, pesquisarReuniaoPorEstado,
    pesquisarReuniaoPorId, pesquisarReuniaoPorIdComissao,
    pesquisarReuniaoPorIdProcesso,
    anexarDocument
} from "./reuniao.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import multer from "multer";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});


router.post("/agendar", authMiddleware, agendarReuniao);
router.patch("/editar/:id", authMiddleware, editarReuniao);
router.get("/visualizar", authMiddleware, visualizarReuniao);
router.get("/pesquisar/:id", authMiddleware, pesquisarReuniaoPorId);
router.get("/pesquisar/comissao/:idCom", authMiddleware, pesquisarReuniaoPorIdComissao);
router.get("/pesquisar/processo/:idProc", authMiddleware, pesquisarReuniaoPorIdProcesso);
router.get("/pesquisar/estado", authMiddleware, pesquisarReuniaoPorEstado);
router.post("/anexardocumento", authMiddleware, upload.single("ficheiro"), anexarDocument);

export default router;
