/*
  Warnings:

  - Added the required column `chat_type_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chats` ADD COLUMN     `chat_type_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `chat_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chats` ADD FOREIGN KEY (`chat_type_id`) REFERENCES `chat_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
