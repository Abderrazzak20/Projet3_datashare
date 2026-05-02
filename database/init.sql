-- =====================================
-- DATASHARE INIT DATABASE
-- =====================================

CREATE DATABASE datashare;
\c datashare;

-- USERS TABLE
CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- FILES TABLE
CREATE TABLE user_file (
    id BIGSERIAL PRIMARY KEY,
    download_token VARCHAR(255) NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    created_at TIMESTAMP,
    expires_at TIMESTAMP,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX idx_token ON user_file(download_token);