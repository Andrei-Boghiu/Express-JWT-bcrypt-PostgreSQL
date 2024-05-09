CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    authority_level INT DEFAULT 6
)

INSERT INTO roles (id, name, authority_level)
VALUES 
    (1809, 'user', 5),
    (1856, 'allocator', 4), 
    (1911, 'team_admin', 3), 
    (1945, 'manager', 2), 
    (1969, 'admin', 1),
    (1971, 'dev', 0)