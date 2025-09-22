/*
  Warnings:

  - You are about to drop the column `papelNoProcesso` on the `Envolvido` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[funcionarioId]` on the table `Envolvido` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `papelNoProcesso` to the `EnvolvidoProcessoJuridico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Envolvido` DROP COLUMN `papelNoProcesso`,
    ADD COLUMN `funcionarioId` INTEGER NULL,
    ADD COLUMN `interno` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `EnvolvidoProcessoJuridico` ADD COLUMN `papelNoProcesso` ENUM('Autor', 'Réu', 'Testemunha', 'Perito', 'Outro') NOT NULL;

-- CreateTable
CREATE TABLE `EventoSistema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `funcionarioId` INTEGER NULL,
    `entidade` VARCHAR(191) NOT NULL,
    `entidadeId` INTEGER NULL,
    `tipoEvento` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'OTHER') NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Envolvido_funcionarioId_key` ON `Envolvido`(`funcionarioId`);

-- AddForeignKey
ALTER TABLE `EventoSistema` ADD CONSTRAINT `EventoSistema_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Envolvido` ADD CONSTRAINT `Envolvido_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
