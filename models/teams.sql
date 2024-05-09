CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_by INT REFERENCES users(id),
    owned_by INT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    approved_by INT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a test team
INSERT INTO teams (name, description, created_by, owned_by,approved, approved_by) 
VALUES ('DEV TESTS', 'A special team of developers performing maintenance and updates for this tool', 1,1, TRUE, 1 )