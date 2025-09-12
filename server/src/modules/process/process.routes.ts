import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as processController from "./process.controller";

const router = Router();

router.post("/register", authMiddleware, processController.registerProcess);
router.patch("/edit/:id", authMiddleware, processController.editProcess);
router.get("/getbyid/:id", authMiddleware, processController.getProcessById);

/*
getProcessByNumber
listProcesses
archiveProcess
*/

router.get("/getbynumber/:numeroProcesso", authMiddleware, processController.getProcessByNumber);
router.get("/list", authMiddleware, processController.listProcesses);
router.post("/archive/:id", authMiddleware, processController.archiveProcess);

export default router;
