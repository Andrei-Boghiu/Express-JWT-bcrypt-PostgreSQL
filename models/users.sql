CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    isDev BOOLEAN DEFAULT FALSE,
    isAdmin BOOLEAN DEFAULT FALSE,
    isTeamAdmin BOOLEAN DEFAULT FALSE,
    isManager BOOLEAN DEFAULT FALSE,
    isAllocator BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    approved BOOLEAN DEFAULT FALSE,
    team_id INT DEFAULT 0, -- SET INITIALLY TO INT AND ADD CONSTRAINT LATER 
);

-- id, email, first_name, last_name, role, team_id, isAdmin, isTeamAdmin, isManager, isAllocator, active, last_login, approved 
-- CONSTRAINT TO BE ADDED LATER FOR team_id column
ALTER TABLE users ADD CONSTRAINT team_id_fk FOREIGN KEY (team_id) REFERENCES teams(team_id) NULL;
