/*
  Warnings:

  - You are about to drop the column `numero_identificacao` on the `Funcionario` table. All the data in the column will be lost.
  - Added the required column `departamentoId` to the `Funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroIdentificacao` to the `Funcionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Funcionario` DROP COLUMN `numero_identificacao`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `departamentoId` INTEGER NOT NULL,
    ADD COLUMN `numeroIdentificacao` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Departamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProcessoJuridico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `numeroProcesso` VARCHAR(191) NOT NULL,
    `dataAbertura` DATETIME(3) NOT NULL,
    `assunto` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL,
    `dataEncerramento` DATETIME(3) NOT NULL,
    `queixaId` INTEGER NULL,

    UNIQUE INDEX `ProcessoJuridico_queixaId_key`(`queixaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `tipoDocumento` VARCHAR(191) NOT NULL,
    `ficheiro` LONGBLOB NOT NULL,
    `processoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reuniao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `dataHora` DATETIME(3) NOT NULL,
    `local` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `documentoId` INTEGER NOT NULL,
    `processoId` INTEGER NOT NULL,
    `comissaoId` INTEGER NOT NULL,

    UNIQUE INDEX `Reuniao_documentoId_key`(`documentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Queixa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `dataEntrada` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `Status` BOOLEAN NOT NULL,
    `ficheiro` LONGBLOB NOT NULL,
    `pPassivaId` INTEGER NOT NULL,

    UNIQUE INDEX `Queixa_pPassivaId_key`(`pPassivaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartePassiva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parecer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `dataEmissao` DATETIME(3) NOT NULL,
    `processoId` INTEGER NOT NULL,

    UNIQUE INDEX `Parecer_processoId_key`(`processoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Decisao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `tipoDecisao` VARCHAR(191) NOT NULL,
    `dataDecisao` DATETIME(3) NOT NULL,
    `processoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comissao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `dataEncerramento` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Envolvido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `identificao` VARCHAR(191) NOT NULL,
    `papelNoProcesso` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QueixaDepartamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `queixaId` INTEGER NOT NULL,
    `departamentoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComissaoFuncionario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `comissaoId` INTEGER NOT NULL,
    `funcionarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FuncionarioPartePassiva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `partePassivaId` INTEGER NOT NULL,
    `funcionarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnvolvidoProcessoJuridico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `envolvidoId` INTEGER NOT NULL,
    `processoJuridicoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Funcionario` ADD CONSTRAINT `Funcionario_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProcessoJuridico` ADD CONSTRAINT `ProcessoJuridico_queixaId_fkey` FOREIGN KEY (`queixaId`) REFERENCES `Queixa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Documento` ADD CONSTRAINT `Documento_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `ProcessoJuridico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `ProcessoJuridico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_comissaoId_fkey` FOREIGN KEY (`comissaoId`) REFERENCES `Comissao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Queixa` ADD CONSTRAINT `Queixa_pPassivaId_fkey` FOREIGN KEY (`pPassivaId`) REFERENCES `PartePassiva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parecer` ADD CONSTRAINT `Parecer_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `ProcessoJuridico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Decisao` ADD CONSTRAINT `Decisao_processoId_fkey` FOREIGN KEY (`processoId`) REFERENCES `ProcessoJuridico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueixaDepartamento` ADD CONSTRAINT `QueixaDepartamento_queixaId_fkey` FOREIGN KEY (`queixaId`) REFERENCES `Queixa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QueixaDepartamento` ADD CONSTRAINT `QueixaDepartamento_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Departamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComissaoFuncionario` ADD CONSTRAINT `ComissaoFuncionario_comissaoId_fkey` FOREIGN KEY (`comissaoId`) REFERENCES `Comissao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComissaoFuncionario` ADD CONSTRAINT `ComissaoFuncionario_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuncionarioPartePassiva` ADD CONSTRAINT `FuncionarioPartePassiva_partePassivaId_fkey` FOREIGN KEY (`partePassivaId`) REFERENCES `PartePassiva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuncionarioPartePassiva` ADD CONSTRAINT `FuncionarioPartePassiva_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnvolvidoProcessoJuridico` ADD CONSTRAINT `EnvolvidoProcessoJuridico_envolvidoId_fkey` FOREIGN KEY (`envolvidoId`) REFERENCES `Envolvido`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnvolvidoProcessoJuridico` ADD CONSTRAINT `EnvolvidoProcessoJuridico_processoJuridicoId_fkey` FOREIGN KEY (`processoJuridicoId`) REFERENCES `ProcessoJuridico`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
