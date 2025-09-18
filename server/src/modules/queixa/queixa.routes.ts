import { Router } from "express";
import { cadastrar, editar, visualizar, baixarDocumento } from "./queixa.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import multer from "multer";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/cadastrar", authMiddleware, cadastrar);
router.patch("/editar/:id", authMiddleware,  upload.single("ficheiro"), editar);
router.get("/visualizar", authMiddleware, visualizar);
router.get("/downloadDocumento/:id", authMiddleware, baixarDocumento);
export default router;