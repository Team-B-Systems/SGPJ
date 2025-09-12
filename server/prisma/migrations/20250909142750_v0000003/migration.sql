/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Funcionario` ADD COLUMN `role` ENUM('Admin', 'Chefe', 'Funcionário') NOT NULL;

-- DropTable
DROP TABLE `Admin`;
