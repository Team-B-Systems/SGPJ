/*
  Warnings:

  - A unique constraint covering the columns `[numeroIdentificacao]` on the table `Envolvido` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numeroIdentificacao]` on the table `Funcionario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Envolvido_numeroIdentificacao_key` ON `Envolvido`(`numeroIdentificacao`);

-- CreateIndex
CREATE UNIQUE INDEX `Funcionario_numeroIdentificacao_key` ON `Funcionario`(`numeroIdentificacao`);
