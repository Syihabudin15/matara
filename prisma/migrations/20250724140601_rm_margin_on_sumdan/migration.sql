/*
  Warnings:

  - You are about to drop the column `margin` on the `sumdan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sumdan` DROP COLUMN `margin`,
    ADD COLUMN `skAkad` TEXT NULL;
