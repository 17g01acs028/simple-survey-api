/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Response` DROP FOREIGN KEY `Response_sessionId_fkey`;

-- DropTable
DROP TABLE `Session`;
