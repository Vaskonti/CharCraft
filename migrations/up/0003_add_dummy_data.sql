INSERT INTO users (username, password, email, created_at)
VALUES ( 'alice', 'hashed_password_1', 'alice@example.com', NOW()),
       ( 'bob', 'hashed_password_2', 'bob@example.com', NOW()),
       ( 'charlie', 'hashed_password_3', 'charlie@example.com', NOW());
-- Insert ASCII Images
INSERT INTO ascii_images (user_id, path, created_at, updated_at, is_archived)
VALUES ( 1, '/ascii/alice_art_1.txt', NOW(), NOW(), FALSE),
       ( 2, '/ascii/bob_art_1.txt', NOW(), NOW(), FALSE),
       ( 3, '/ascii/charlie_art_1.txt', NOW(), NOW(), TRUE);
-- Insert Posts
INSERT INTO posts ( title, content, user_id, ascii_image_id, created_at, likes)
VALUES ('First Post', 'Check out my ASCII art!', 1, 1, NOW(), 10),
       ('Amazing Art', 'Look at this masterpiece!', 2, 2, NOW(), 5),
       ('Throwback', 'My first ASCII drawing.', 3, 3, NOW(), 20);
-- Insert Comments
INSERT INTO comments (content, post_id, user_id, likes)
VALUES ('This is awesome!', 1, 2, 3),
       ('I love it!', 1, 3, 5),
       ('Nice work!', 2, 1, 7);
-- Insert Entity Likes (User liking Posts, Comments, or ASCII Art)
INSERT INTO entity_likes (user_id, entity_type, entity_id, created_at)
VALUES (1, 'post', 2, NOW()),    -- Alice likes Bob's post
       (2, 'comment', 1, NOW()), -- Bob likes Alice's comment
       ( 3, 'ascii_image', 1, NOW());