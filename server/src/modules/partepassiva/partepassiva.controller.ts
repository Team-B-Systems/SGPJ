import { Request, Response } from "express";
import * as partePassivaService from "./partepassiva.service";
import ApiException from "../../common/Exceptions/api.exception";


export const cadastrar = async (req: Request, res: Response) => {
    try {
        const result = await partePassivaService.cadastrar(req.body);
        res.json(result);
    } catch (err: any) {
        if (err instanceof ApiException) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({ error: `Internal Server Error ${err.message}` });
        }
    }

}