/*
  Warnings:

  - You are about to drop the column `usersId` on the `detailpengajuan` table. All the data in the column will be lost.
  - Added the required column `coordinates` to the `Pengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `desc` to the `Pengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailPengajuanId` to the `Pengajuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Pengajuan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detailpengajuan` DROP FOREIGN KEY `DetailPengajuan_usersId_fkey`;

-- DropIndex
DROP INDEX `DetailPengajuan_usersId_fkey` ON `detailpengajuan`;

-- AlterTable
ALTER TABLE `detailpengajuan` DROP COLUMN `usersId`;

-- AlterTable
ALTER TABLE `pengajuan` ADD COLUMN `coordinates` VARCHAR(191) NOT NULL,
    ADD COLUMN `desc` VARCHAR(191) NOT NULL,
    ADD COLUMN `detailPengajuanId` VARCHAR(191) NOT NULL,
    ADD COLUMN `fileKK` VARCHAR(191) NULL,
    ADD COLUMN `fileKTP` VARCHAR(191) NULL,
    ADD COLUMN `fileNPWP` VARCHAR(191) NULL,
    ADD COLUMN `filePK` VARCHAR(191) NULL,
    ADD COLUMN `fileSLIK` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NOT NULL,
    MODIFY `verifStatus` ENUM('SIMULASI', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    MODIFY `slikStatus` ENUM('SIMULASI', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    MODIFY `approvStatus` ENUM('SIMULASI', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    MODIFY `transferStatus` ENUM('SIMULASI', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    MODIFY `status` ENUM('SIMULASI', 'PENDING', 'PROCCESS', 'APPROVED', 'REJECTED', 'TRANSFERED') NOT NULL DEFAULT 'SIMULASI';

-- AddForeignKey
ALTER TABLE `Pengajuan` ADD CONSTRAINT `Pengajuan_detailPengajuanId_fkey` FOREIGN KEY (`detailPengajuanId`) REFERENCES `DetailPengajuan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
