import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "Bem-vindo à API do SGPJ 😁",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App executando na porta ${PORT}`)
});
