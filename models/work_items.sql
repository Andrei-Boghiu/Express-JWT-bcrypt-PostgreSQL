CREATE TABLE work_items (
    id SERIAL PRIMARY KEY,
    aux_id BIGSERIAL UNIQUE, -- case ID/ Ticket Id
    title VARCHAR(255) NOT NULL, 
    description TEXT,
    assigned_to INTEGER, 
    status VARCHAR(50) NOT NULL DEFAULT 'Unassigned', -- Unassigned / WIP / Resolved
    priority INTEGER DEFAULT 3, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    team_id INT NOT NULL
);