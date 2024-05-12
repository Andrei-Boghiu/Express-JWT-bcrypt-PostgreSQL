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