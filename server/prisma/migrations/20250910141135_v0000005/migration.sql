/*
  Warnings:

  - You are about to drop the column `status` on the `Comissao` table. All the data in the column will be lost.
  - You are about to alter the column `tipoDecisao` on the `Decisao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(9))`.
  - You are about to alter the column `nome` on the `Departamento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `tipoDocumento` on the `Documento` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(6))`.
  - You are about to drop the column `identificao` on the `Envolvido` table. All the data in the column will be lost.
  - You are about to alter the column `papelNoProcesso` on the `Envolvido` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(11))`.
  - You are about to alter the column `categoria` on the `Funcionario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to alter the column `estado` on the `Funcionario` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.
  - You are about to alter the column `estado` on the `ProcessoJuridico` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(5))`.
  - You are about to drop the column `Status` on the `Queixa` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Reuniao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numeroProcesso]` on the table `ProcessoJuridico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estado` to the `Comissao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `papel` to the `ComissaoFuncionario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroIdentificacao` to the `Envolvido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsavelId` to the `ProcessoJuridico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoProcesso` to the `ProcessoJuridico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Queixa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Reuniao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Reuniao` DROP FOREIGN KEY `Reuniao_documentoId_fkey`;

-- AlterTable
ALTER TABLE `Comissao` DROP COLUMN `status`,
    ADD COLUMN `estado` ENUM('Pendente','Aprovada', 'Rejeitada', 'Dispensada') NOT NULL,
    MODIFY `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `dataEncerramento` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ComissaoFuncionario` ADD COLUMN `papel` ENUM('Presidente', 'Membro') NOT NULL;

-- AlterTable
ALTER TABLE `Decisao` MODIFY `descricao` VARCHAR(1000) NOT NULL,
    MODIFY `tipoDecisao` ENUM('Favoravel', 'Desfavoravel', 'Neutra') NOT NULL;

-- AlterTable
ALTER TABLE `Departamento` MODIFY `nome` ENUM('RecursosHumanos', 'Jurídico', 'Financeiro', 'TI') NOT NULL;

-- AlterTable
ALTER TABLE `Documento` MODIFY `tipoDocumento` ENUM('Relatório', 'Ata', 'Parecer', 'Decisão', 'Contestação', 'Prova', 'Outro') NOT NULL;

-- AlterTable
ALTER TABLE `Envolvido` DROP COLUMN `identificao`,
    ADD COLUMN `numeroIdentificacao` VARCHAR(191) NOT NULL,
    MODIFY `papelNoProcesso` ENUM('Autor', 'Réu', 'Testemunha', 'Perito', 'Outro') NOT NULL;

-- AlterTable
ALTER TABLE `Funcionario` MODIFY `categoria` ENUM('Técnico', 'Chefe') NOT NULL,
    MODIFY `estado` ENUM('Ativo', 'Inativo') NOT NULL;

-- AlterTable
ALTER TABLE `Parecer` MODIFY `descricao` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `ProcessoJuridico` ADD COLUMN `responsavelId` INTEGER NOT NULL,
    ADD COLUMN `tipoProcesso` ENUM('Disciplinar', 'Laboral', 'Administrativo', 'Cível', 'Criminal') NOT NULL,
    MODIFY `estado` ENUM('Aberto', 'EmAndamento', 'Arquivado') NOT NULL,
    MODIFY `dataEncerramento` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Queixa` DROP COLUMN `Status`,
    ADD COLUMN `estado` ENUM('Pendente', 'EmAnalise', 'Aceite', 'Rejeitada') NOT NULL,
    MODIFY `descricao` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `Reuniao` DROP COLUMN `status`,
    ADD COLUMN `estado` ENUM('Agendada', 'Concluida', 'Cancelada', 'EmAndamento') NOT NULL,
    MODIFY `documentoId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProcessoJuridico_numeroProcesso_key` ON `ProcessoJuridico`(`numeroProcesso`);

-- AddForeignKey
ALTER TABLE `ProcessoJuridico` ADD CONSTRAINT `ProcessoJuridico_responsavelId_fkey` FOREIGN KEY (`responsavelId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reuniao` ADD CONSTRAINT `Reuniao_documentoId_fkey` FOREIGN KEY (`documentoId`) REFERENCES `Documento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
