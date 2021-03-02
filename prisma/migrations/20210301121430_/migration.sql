/*
  Warnings:

  - You are about to drop the column `social_id` on the `users` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[email]` on the table `users`. If there are existing duplicate values, the migration will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users.social_id_unique` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `social_id`,
    ADD COLUMN     `email` VARCHAR(300) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users.email_unique` ON `users`(`email`);
