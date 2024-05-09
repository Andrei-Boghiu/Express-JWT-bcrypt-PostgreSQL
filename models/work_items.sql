CREATE TABLE work_items (
    id SERIAL PRIMARY KEY,
    aux_id VARCHAR(100) UNIQUE NOT NULL,
    aux_tool VARCHAR(255) NOT NULL,
    aux_subject TEXT,
    aux_status VARCHAR(50),
    aux_queue VARCHAR(100),
    aux_creation_date TIMESTAMP WITH TIME ZONE,
    assignee_id INTEGER,
    assignee_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Unassigned', -- Unassigned / WIP / Resolved / Reopened / Removed
    priority INTEGER DEFAULT 3, 
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_assigned_at TIMESTAMP WITH TIME ZONE,
    last_resolved_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    team_id INT NOT NULL
    FOREIGN KEY (assigned_to) REFERENCES users(id),
);