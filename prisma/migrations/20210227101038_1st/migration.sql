-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `profile_url` VARCHAR(1500) NOT NULL,
    `social_id` VARCHAR(300) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3),
    `deleted_at` DATETIME(3),
    `social_type_id` INTEGER NOT NULL,
UNIQUE INDEX `users.social_id_unique`(`social_id`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `social_login_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chats` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(2000) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sender_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_images` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(1500) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sender_id` VARCHAR(191) NOT NULL,
    `room_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `location` JSON,
    `reserved_time` DATETIME(3),
    `completed_time` DATETIME(3),
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3),
    `deleted_at` DATETIME(3),
    `room_status_id` INTEGER NOT NULL,
    `inviter_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` CHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD FOREIGN KEY (`social_type_id`) REFERENCES `social_login_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_images` ADD FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_images` ADD FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD FOREIGN KEY (`room_status_id`) REFERENCES `room_status`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
