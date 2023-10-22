-- Migration number: 0001 	 2023-09-30T16:36:43.503Z
-- Create 'test_users' table
CREATE TABLE IF NOT EXISTS test_users (
    id INTEGER PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);