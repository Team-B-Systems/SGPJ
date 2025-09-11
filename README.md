# Passos para colocar o projeto em execução 🚀

## Passos para configurar a API

Navegue até a pasta `server` e podemos começar 😁😁.

1. Criar um arquivo `.env`, neste arquivo coloque o seguinte conteúdo:
  ```env
  DATABASE_URL=COLOQUE_AQUI_A_SUA_STRING_DE_CONEXAO_DA_BD
  PORT=PORTA_ONDE_A_APLICAÇÃO_IRÁ_EXECUTAR

  // NÃO COPIAR A PARTIR DAQUI. EXEMPLO:

  DATABASE_URL=mysql://root:1234567890@localhost:3306/sgpj
  ```
2. Instale as dependências do projeto:
  ```bash
  npm install
  ```

4. À seguir rode o modelo prisma na BD, com o comando:
  ```bash
  npx prisma migrate deploy
  ```
4. Gere as classes prisma com:
  ```bash
  npx prisma generate
  ```
5. Agora execute a aplicação:
  ```bash
  npm run dev
  ```
