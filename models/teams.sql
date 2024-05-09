CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    team_description TEXT,
    team_owner_id INT NOT NULL,
    team_owner_email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a test team
INSERT INTO teams (team_name, team_owner_id, team_owner_email) 
VALUES ('DEV TESTS', 1, 'admin@spacex.com')