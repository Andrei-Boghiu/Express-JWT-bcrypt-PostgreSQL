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

INSERT INTO teams (id, name, description, created_by, owned_by,approved, approved_by) 
VALUES 
	(1959, 'Development', 'A special team of developers performing maintenance and updates for this tool', 1,1, TRUE, 1 ), -- will have as work items feature requests and reported bugs from users 
	(1930, 'General Admins', 'A special team of admins having the highest authority level.', 1,1, TRUE, 1 ), -- will not have work items. will only manage teams and users, and view statistics.
    (1914, 'Team Admins', 'A special team of admins having the required authority level to create and manage teams.', 1,1, TRUE, 1 ), -- will be able to create teams and manager their team/s.
    (1, 'Forlorn hope', 'Small infantry units of soldiers chosen to take the vanguard in a military operation.', 1,1, TRUE, 1), -- will be used for tests
    (2, 'Kamikaze Pilots', 'The Japanese word "kamikaze" is usually translated as "divine wind".', 1,1, TRUE, 1); -- will be used for tests


-- * Because I preassigned the id when inserting the teams, Postgres doesn't know that the ID of 1 is taken
-- * and will try to assign the vale 1 for the next INSERT INTO statement that doesn't specify an id
-- * Work Around: run the following query to set the next iteration to start from the highest id number + 1
SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams) + 1)