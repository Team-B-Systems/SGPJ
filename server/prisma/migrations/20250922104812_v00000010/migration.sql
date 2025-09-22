/*
  Warnings:

  - A unique constraint covering the columns `[comissaoId]` on the table `ProcessoJuridico` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ProcessoJuridico` ADD COLUMN `comissaoId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProcessoJuridico_comissaoId_key` ON `ProcessoJuridico`(`comissaoId`);

-- AddForeignKey
ALTER TABLE `ProcessoJuridico` ADD CONSTRAINT `ProcessoJuridico_comissaoId_fkey` FOREIGN KEY (`comissaoId`) REFERENCES `Comissao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
