-- DropIndex
DROP INDEX `Response_sessionId_fkey` ON `Response`;

-- AlterTable
ALTER TABLE `Response` MODIFY `sessionId` VARCHAR(191) NOT NULL;
