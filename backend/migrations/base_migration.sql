-- Insert dummy users
INSERT INTO users (id, username, password, email, created_at)
VALUES (1, 'user1', 'hashedpassword1', 'user1@example.com', NOW()),
       (2, 'user2', 'hashedpassword2', 'user2@example.com', NOW()),
       (3, 'user3', 'hashedpassword3', 'user3@example.com', NOW()),
       (4, 'user4', 'hashedpassword4', 'user4@example.com', NOW()),
       (5, 'user5', 'hashedpassword5', 'user5@example.com', NOW());

-- Insert dummy ASCII images
INSERT INTO ascii_images (id, user_id, path, created_at, updated_at)
VALUES (1, 1, '/ascii_art/art1.txt', NOW(), NOW()),
       (2, 2, '/ascii_art/art2.txt', NOW(), NOW()),
       (3, 3, '/ascii_art/art3.txt', NOW(), NOW()),
       (4, 4, '/ascii_art/art4.txt', NOW(), NOW()),
       (5, 5, '/ascii_art/art5.txt', NOW(), NOW());

-- Insert dummy posts
INSERT INTO posts (id, title, description, ascii_image_id, created_at, likes, is_archived)
VALUES (1, 'Cool Art 1', 'This is an ASCII masterpiece!', 1, NOW(), 10, FALSE),
       (2, 'Amazing Art 2', 'Check out this ASCII creation.', 2, NOW(), 5, FALSE),
       (3, 'Creative ASCII 3', 'A unique ASCII artwork.', 3, NOW(), 8, FALSE),
       (4, 'Innovative ASCII 4', 'A new take on ASCII.', 4, NOW(), 12, FALSE),
       (5, 'Classic ASCII 5', 'Timeless ASCII art.', 5, NOW(), 15, FALSE),
       (6, 'ASCII Design 6', 'Another artistic attempt.', 1, NOW(), 7, FALSE),
       (7, 'ASCII Wonder 7', 'A mesmerizing design.', 2, NOW(), 6, FALSE),
       (8, 'ASCII Universe 8', 'An intergalactic ASCII.', 3, NOW(), 9, FALSE),
       (9, 'ASCII Puzzle 9', 'Mind-bending ASCII.', 4, NOW(), 4, FALSE),
       (10, 'ASCII Flow 10', 'A seamless ASCII flow.', 5, NOW(), 11, FALSE);

-- Insert dummy comments
INSERT INTO comments (id, content, post_id, user_id, likes)
VALUES (1, 'Awesome art!', 1, 2, 3),
       (2, 'Really cool!', 1, 3, 2),
       (3, 'This is amazing.', 2, 1, 5),
       (4, 'Nice work!', 3, 4, 7),
       (5, 'Super creative!', 4, 5, 6),
       (6, 'I love this!', 5, 1, 8),
       (7, 'This is impressive.', 6, 2, 4),
       (8, 'Fantastic job!', 7, 3, 5),
       (9, 'Mind-blowing!', 8, 4, 3),
       (10, 'Brilliant piece!', 9, 5, 9);

-- Insert dummy follows
INSERT INTO follows (following_user_id, followed_user_id, created_at)
VALUES (1, 2, NOW()),
       (2, 3, NOW()),
       (3, 4, NOW()),
       (4, 5, NOW()),
       (5, 1, NOW());

-- Insert dummy likes
INSERT INTO entity_likes (id, user_id, entity_type, entity_id, created_at)
VALUES (1, 1, 'post', 2, NOW()),
       (2, 2, 'post', 3, NOW()),
       (3, 3, 'comment', 1, NOW()),
       (4, 4, 'post', 4, NOW()),
       (5, 5, 'post', 5, NOW()),
       (6, 1, 'comment', 2, NOW()),
       (7, 2, 'comment', 3, NOW()),
       (8, 3, 'comment', 4, NOW()),
       (9, 4, 'post', 6, NOW()),
       (10, 5, 'post', 7, NOW());
