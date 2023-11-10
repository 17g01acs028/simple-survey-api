/*
  Warnings:

  - You are about to drop the column `name` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `responce` on the `Response` table. All the data in the column will be lost.
  - Added the required column `response` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Response` DROP COLUMN `name`,
    DROP COLUMN `responce`,
    ADD COLUMN `response` VARCHAR(191) NOT NULL,
    ADD COLUMN `sessionId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Session_sessionId_key`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Response` ADD CONSTRAINT `Response_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
