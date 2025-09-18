import express, { Request, Response } from "express";
import cors from "cors";
import expressListRoutes from 'express-list-routes'
import authRouter from './modules/auth/auth.routes';
import userRouter from "./modules/user/user.routes";
import adminRouter from "./modules/admin/admin.routes";
import queixaRouter from "./modules/queixa/queixa.routes";
import processRouter from "./modules/process/process.routes";
import documentsRouter from "./modules/documents/documents.routes";
import comissaoRouter from "./modules/comissao/comissao.routes";
import reuniaoRouter from "./modules/reuniao/reuniao.routes";
import parteenvolvido from "./modules/parteenvolvido/parteenvolvido.routes";
import pPassivaRouter from "./modules/partepassiva/partepassiva.routes";


const PORT = process.env.PORT || 3000;

console.log(`\nIniciando o servidor na porta ${PORT}... 😁\n`)

const app = express();

app.use(
  cors({
    origin: "http://localhost:3003", // ou "*" para liberar tudo
    credentials: true,               // se fores enviar cookies ou headers de auth
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.get("/", (_: Request, res: Response) => {
  res.json({
    msg: "Bem-vindo à API do SGPJ 😁",
  });
});

expressListRoutes(app, { prefix: "", forceUnixPathStyle: true });

app.use("/auth", authRouter);

expressListRoutes(authRouter, { prefix: "/auth", forceUnixPathStyle: true });

app.use("/funcionario", userRouter);

app.use("/queixa", queixaRouter)

expressListRoutes(queixaRouter, { prefix: "/queixa", forceUnixPathStyle: true });

expressListRoutes(userRouter, { prefix: "/funcionario", forceUnixPathStyle: true });

app.use("/admin", adminRouter)

expressListRoutes(adminRouter, { prefix: "/admin", forceUnixPathStyle: true });

app.use("/process", processRouter)

expressListRoutes(processRouter, { prefix: "/process", forceUnixPathStyle: true });

app.use("/comissao", comissaoRouter)

expressListRoutes(comissaoRouter, { prefix: "/comissao", forceUnixPathStyle: true });

app.use("/documents", documentsRouter)

expressListRoutes(documentsRouter, { prefix: "/documents", forceUnixPathStyle: true });

app.use("/parteenvolvido", parteenvolvido)

expressListRoutes(parteenvolvido, { prefix: "/parteenvolvido", forceUnixPathStyle: true });

app.use("/reuniao", reuniaoRouter)

expressListRoutes(reuniaoRouter, { prefix: "/reuniao", forceUnixPathStyle: true });

app.use("/partepassiva", pPassivaRouter)

expressListRoutes(pPassivaRouter, { prefix: "/partepassiva", forceUnixPathStyle: true });


app.listen(PORT, () => {
  console.log(`\nApp executando na porta ${PORT} 🚀🆗✅`)
});