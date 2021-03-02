/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[social_id,social_type_id]` on the table `users`. If there are existing duplicate values, the migration will fail.
  - Added the required column `social_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `users.email_unique` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `email`,
    ADD COLUMN     `social_id` VARCHAR(300) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users.social_id_social_type_id_unique` ON `users`(`social_id`, `social_type_id`);
