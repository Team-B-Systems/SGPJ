import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // formato: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // adiciona payload no request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token expirado ou inválido" });
  }
};