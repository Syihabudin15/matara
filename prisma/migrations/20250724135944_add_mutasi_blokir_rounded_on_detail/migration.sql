/*
  Warnings:

  - Added the required column `blokir` to the `DetailPengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costMutasi` to the `DetailPengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rounded` to the `DetailPengajuan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detailpengajuan` ADD COLUMN `blokir` INTEGER NOT NULL,
    ADD COLUMN `costMutasi` INTEGER NOT NULL,
    ADD COLUMN `rounded` INTEGER NOT NULL;
