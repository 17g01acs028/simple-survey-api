-- AlterTable
ALTER TABLE `Question` ADD COLUMN `filePropertiesId` INTEGER NULL;

-- CreateTable
CREATE TABLE `FileProperties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `format` VARCHAR(191) NOT NULL,
    `max_file_size` DOUBLE NOT NULL,
    `max_file_size_unit` VARCHAR(191) NOT NULL,
    `multiple` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_filePropertiesId_fkey` FOREIGN KEY (`filePropertiesId`) REFERENCES `FileProperties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
