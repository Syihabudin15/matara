/*
  Warnings:

  - Added the required column `bpp` to the `DetailPengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pelunasan` to the `DetailPengajuan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detailpengajuan` ADD COLUMN `bpp` INTEGER NOT NULL,
    ADD COLUMN `pelunasan` INTEGER NOT NULL;
