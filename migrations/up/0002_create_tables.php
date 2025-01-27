<?php
require __DIR__ . '/../../vendor/autoload.php';

$db = \Backend\Database\Database::connect();

$db->query("DROP DATABASE IF EXISTS `char_craft`;");

$db->query("CREATE DATABASE `char_craft`;");
$db->query("USE `char_craft`;");
$db->query("CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255),
  `password` varchar(255),
  `email` varchar(255),
  `created_at` timestamp default CURRENT_TIMESTAMP
);");

$db->query("CREATE TABLE `posts` (
 `id` integer PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `content` varchar(255),
  `user_id` integer,
  `ascii_image_id` integer,
  `created_at` timestamp default CURRENT_TIMESTAMP,
  `likes` bigint default 0
);");

$db->query("CREATE TABLE `comments` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `content` varchar(255),
  `post_id` integer,
  `user_id` integer,
  `likes` bigint default 0,
  `created_at` timestamp default CURRENT_TIMESTAMP
);");

$db->query("CREATE TABLE `entity_likes` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `entity_type` varchar(255),
  `entity_id` integer,
  `created_at` timestamp default CURRENT_TIMESTAMP
);");

$db->query("CREATE TABLE `ascii_images` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer,
  `path` varchar(255),
  `created_at` timestamp default CURRENT_TIMESTAMP,
  `updated_at` timestamp default CURRENT_TIMESTAMP,
  `is_archived` boolean default false
);");

$db->query("CREATE TABLE `follows` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `following_user_id` integer,
  `followed_user_id` integer,
  `created_at` timestamp default CURRENT_TIMESTAMP
);");

$db->query("ALTER TABLE `posts` ADD FOREIGN KEY (`ascii_image_id`) REFERENCES `ascii_images` (`id`);");
$db->query("ALTER TABLE `posts` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);");
$db->query("ALTER TABLE `entity_likes` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);");
$db->query("ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);");
$db->query("ALTER TABLE `comments` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`);");
$db->query("ALTER TABLE `follows` ADD FOREIGN KEY (`following_user_id`) REFERENCES `users` (`id`);");
$db->query("ALTER TABLE `follows` ADD FOREIGN KEY (`followed_user_id`) REFERENCES `users` (`id`);");
