import { Router } from "express";
import { cadastrar} from "./partepassiva.controller";

const router = Router();

router.post("/cadastrar", cadastrar);
export default router;