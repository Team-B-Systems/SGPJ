import express, { Request, Response } from "express";
import expressListRoutes from 'express-list-routes'
import authRouter from './modules/auth/auth.routes';
import userRouter from "./modules/user/user.routes";
import adminRouter from "./modules/admin/admin.routes";


const PORT = process.env.PORT || 3000;

console.log(`\nIniciando o servidor na porta ${PORT}... 😁\n`)

const app = express();
app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.json({
    msg: "Bem-vindo à API do SGPJ 😁",
  });
});

expressListRoutes(app, { prefix: "", forceUnixPathStyle: true });

app.use("/auth", authRouter);

expressListRoutes(authRouter, { prefix: "/auth", forceUnixPathStyle: true });

app.use("/funcionario", userRouter);

expressListRoutes(userRouter, { prefix: "/funcionario", forceUnixPathStyle: true });

app.use("/admin", adminRouter)

expressListRoutes(adminRouter, { prefix: "/admin", forceUnixPathStyle: true });

app.listen(PORT, () => {
    console.log(`\nApp executando na porta ${PORT} 🚀🆗✅`)
});
