import { Router } from "express";
import { cadastrar} from "./departamento.controller";

const router = Router();

router.post("/cadastrar", cadastrar);
export default router;