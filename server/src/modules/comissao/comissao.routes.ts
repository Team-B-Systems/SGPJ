import { Router } from "express";
import { cadastrar,editar} from "./comissao.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/cadastrar", authMiddleware, cadastrar);
router.post("/editar/:id", authMiddleware, editar);
/*router.get("/visualizar", authMiddleware, visualizar);
router.post("/pesquisar/:id", authMiddleware, pesquisar);*/
export default router;