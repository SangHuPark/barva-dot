-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(15) NOT NULL,
    `user_pw` VARCHAR(200) NOT NULL,
    `pw_salt` VARCHAR(200) NOT NULL,
    `user_name` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
