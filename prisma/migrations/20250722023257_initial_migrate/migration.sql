-- CreateTable
CREATE TABLE `Devices` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL,
    `deviceName` VARCHAR(191) NOT NULL,
    `deviceType` VARCHAR(191) NOT NULL,
    `sistem` VARCHAR(191) NOT NULL,
    `browser` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Devices_deviceId_key`(`deviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` TEXT NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `menu` TEXT NULL,
    `face` TEXT NULL,
    `image` TEXT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `role` ENUM('DEVELOPER', 'ADMIN', 'OPERASIONAL', 'ACCOUNTING', 'MOC') NOT NULL DEFAULT 'MOC',
    `authType` ENUM('FACE', 'CREDENTIAL') NOT NULL DEFAULT 'CREDENTIAL',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `unitId` VARCHAR(191) NULL,
    `sumdanId` VARCHAR(191) NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_nik_key`(`nik`),
    UNIQUE INDEX `Users_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Area` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Area_code_key`(`code`),
    UNIQUE INDEX `Area_phone_key`(`phone`),
    UNIQUE INDEX `Area_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `areaId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Unit_code_key`(`code`),
    UNIQUE INDEX `Unit_phone_key`(`phone`),
    UNIQUE INDEX `Unit_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sumdan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NOT NULL,
    `margin` DOUBLE NOT NULL DEFAULT 0,
    `maxInstallment` DOUBLE NOT NULL DEFAULT 95,
    `rounded` INTEGER NOT NULL DEFAULT 100,
    `sumdanType` ENUM('FRONTING', 'CHANNELLING') NOT NULL DEFAULT 'CHANNELLING',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Sumdan_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `minAge` DOUBLE NOT NULL,
    `maxAge` DOUBLE NOT NULL,
    `maxPaidAge` DOUBLE NOT NULL,
    `maxPlafon` INTEGER NOT NULL,
    `maxTenor` INTEGER NOT NULL,
    `marginSumdan` DOUBLE NOT NULL DEFAULT 0,
    `marginKoperasi` DOUBLE NOT NULL DEFAULT 0,
    `constInsurance` DOUBLE NOT NULL,
    `costAdmSumdan` DOUBLE NOT NULL,
    `costAdmKoperasi` DOUBLE NOT NULL,
    `costGovernance` INTEGER NOT NULL,
    `costStamp` INTEGER NOT NULL,
    `costAccount` INTEGER NOT NULL,
    `costProvision` DOUBLE NOT NULL,
    `jenisMargin` ENUM('ANUITAS', 'FLAT') NOT NULL DEFAULT 'ANUITAS',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sumdanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jenis` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `costMutasi` INTEGER NOT NULL,
    `blokir` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengajuan` (
    `id` VARCHAR(191) NOT NULL,
    `nopen` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `verifStatus` ENUM('SIMULASI', 'PROCCESS', 'PENDING', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    `verifDesc` TEXT NULL,
    `verifDate` DATETIME(3) NULL,
    `slikStatus` ENUM('SIMULASI', 'PROCCESS', 'PENDING', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    `slikDesc` TEXT NULL,
    `slikDate` DATETIME(3) NULL,
    `approvStatus` ENUM('SIMULASI', 'PROCCESS', 'PENDING', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    `approvDesc` TEXT NULL,
    `approvDate` DATETIME(3) NULL,
    `transferStatus` ENUM('SIMULASI', 'PROCCESS', 'PENDING', 'APPROVED', 'REJECTED', 'TRANSFERED') NULL,
    `transferDate` DATETIME(3) NULL,
    `status` ENUM('SIMULASI', 'PROCCESS', 'PENDING', 'APPROVED', 'REJECTED', 'TRANSFERED') NOT NULL DEFAULT 'SIMULASI',
    `statusPaid` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usersId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailPengajuan` (
    `id` VARCHAR(191) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `oldSalary` INTEGER NOT NULL,
    `newSalary` INTEGER NOT NULL,
    `plafon` INTEGER NOT NULL,
    `tenor` INTEGER NOT NULL,
    `marginSumdan` DOUBLE NOT NULL,
    `marginKoperasi` DOUBLE NOT NULL,
    `constInsurance` DOUBLE NOT NULL,
    `costAdmSumdan` DOUBLE NOT NULL,
    `costAdmKoperasi` DOUBLE NOT NULL,
    `costGovernance` INTEGER NOT NULL,
    `costStamp` INTEGER NOT NULL,
    `costAccount` INTEGER NOT NULL,
    `costProvision` DOUBLE NOT NULL,
    `jenisMargin` ENUM('ANUITAS', 'FLAT') NOT NULL DEFAULT 'ANUITAS',
    `produkId` VARCHAR(191) NOT NULL,
    `jenisId` VARCHAR(191) NOT NULL,
    `usersId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produk` ADD CONSTRAINT `Produk_sumdanId_fkey` FOREIGN KEY (`sumdanId`) REFERENCES `Sumdan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengajuan` ADD CONSTRAINT `Pengajuan_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengajuan` ADD CONSTRAINT `DetailPengajuan_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengajuan` ADD CONSTRAINT `DetailPengajuan_jenisId_fkey` FOREIGN KEY (`jenisId`) REFERENCES `Jenis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPengajuan` ADD CONSTRAINT `DetailPengajuan_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
