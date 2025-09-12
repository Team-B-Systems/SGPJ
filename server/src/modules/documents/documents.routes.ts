import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";

import * as documentController from "./documents.controller";
import multer from "multer";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/attach", authMiddleware, upload.single("ficheiro"), documentController.anexarDocumento);

router.get("/process/:processoId", authMiddleware, documentController.listarDocumentosPorProcesso);

router.get("/download/:id", authMiddleware, documentController.baixarDocumento);

export default router;
