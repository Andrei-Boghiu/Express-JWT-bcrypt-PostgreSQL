CREATE TABLE work_items (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) NOT NULL,
    priority INTEGER DEFAULT 6,
    status work_item_status DEFAULT 'Unassigned', -- Unassigned / Work in Progress / Resolved / Reopened / Removed / Pending
    resolution work_item_resolution,
    created_by INT REFERENCES users(id),
    updated_by INT REFERENCES users(id),
    assignee_id INT REFERENCES users(id),
    due_date TIMESTAMP WITH TIME ZONE,
    follow_up_date TIMESTAMP WITH TIME ZONE,

    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_assigned_at TIMESTAMP WITH TIME ZONE,
    last_resolved_at TIMESTAMP WITH TIME ZONE,
  
    aux_id VARCHAR(100) UNIQUE NOT NULL,
    aux_tool VARCHAR(255) NOT NULL,
    aux_subject TEXT,
    aux_status VARCHAR(50),
    aux_queue VARCHAR(100),
    aux_creation_date TIMESTAMP WITH TIME ZONE,
    aux_owner VARCHAR(100),

    additional_info TEXT,
    annotation TEXT
    -- annotation ARRAY of TEXT strings, will be rendered on the case viewer page
    -- annotations can be added by users to let notes on the work item
    -- additional notes like special details of the item or reasons for certain situations 
);