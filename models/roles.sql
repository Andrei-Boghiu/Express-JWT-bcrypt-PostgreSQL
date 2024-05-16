CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    authority_level INT DEFAULT 6
);

INSERT INTO roles (id, name, authority_level)
VALUES
    (1809, 'user', 5), -- Will have access to process work items
    (1856, 'allocator', 4), -- previous role privileges + will have access to insert work items and view team statistics
    (1945, 'manager', 3), -- will have visibility over the team statistics
    (1911, 'team_admin', 2), -- allocator and manager privileges + can create teams (needs approval) and view teams statistics
    (1969, 'admin', 1), -- can approve or deny new teams and manage every team and user
    (1971, 'dev', 0); -- same as admin but will have access to a thread with reported issues and feature requests
    