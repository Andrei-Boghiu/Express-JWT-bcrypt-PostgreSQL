CREATE TABLE user_teams (
    user_id INT REFERENCES users(id),
    team_id INT REFERENCES teams(id),
    role_id INT REFERENCES roles(id),
    approved BOOLEAN DEFAULT FALSE,
    approved_by INT REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id)
);


INSERT INTO user_teams (user_id, team_id, role_id, approved, approved_by, approved_at, joined_at)
VALUES 
	(1, 1959, 1971, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	(1, 1930, 1969, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 1914, 1911, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)