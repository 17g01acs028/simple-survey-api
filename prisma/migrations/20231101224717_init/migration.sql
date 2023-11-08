/*
  Warnings:

  - You are about to drop the column `description` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `email_address` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `programming_stack` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responce` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Certificate` DROP FOREIGN KEY `Certificate_responseId_fkey`;

-- AlterTable
ALTER TABLE `Response` DROP COLUMN `description`,
    DROP COLUMN `email_address`,
    DROP COLUMN `full_name`,
    DROP COLUMN `gender`,
    DROP COLUMN `programming_stack`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `responce` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Certificate`;
