CREATE TABLE `follows` (
  `following_user_id` integer,
  `followed_user_id` integer,
  `created_at` timestamp
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY,
  `username` varchar(255),
  `password` varchar(255),
  `email` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `ascii_images` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `path` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp,
  `is_archived` boolean
);

CREATE TABLE `posts` (
  `id` integer PRIMARY KEY,
  `title` varchar(255),
  `description` varchar(255),
  `ascii_image_id` integer,
  `user_id` integer,
  `created_at` timestamp,
  `likes` bigint
);

CREATE TABLE `comments` (
  `id` integer PRIMARY KEY,
  `content` varchar(255),
  `post_id` integer,
  `user_id` integer,
  `likes` bigint
);

CREATE TABLE `entity_likes` (
  `id` integer PRIMARY KEY,
  `user_id` integer,
  `entity_type` varchar(255),
  `entity_id` integer,
  `created_at` timestamp
);

ALTER TABLE `posts` ADD FOREIGN KEY (`ascii_image_id`) REFERENCES `ascii_images` (`id`);

ALTER TABLE `follows` ADD FOREIGN KEY (`following_user_id`) REFERENCES `users` (`id`);

ALTER TABLE `ascii_images` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `follows` ADD FOREIGN KEY (`followed_user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);

ALTER TABLE `entity_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `posts` (`user_id`);
