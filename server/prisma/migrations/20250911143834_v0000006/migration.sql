/*
  Warnings:

  - Added the required column `funcionarioId` to the `Queixa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Queixa` ADD COLUMN `funcionarioId` INTEGER NOT NULL,
    ADD COLUMN `processoId` INTEGER NULL,
    MODIFY `ficheiro` LONGBLOB NULL;

-- AddForeignKey
ALTER TABLE `Queixa` ADD CONSTRAINT `Queixa_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `Funcionario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
