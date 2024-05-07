CREATE TABLE work_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INTEGER, 
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  
    priority INTEGER DEFAULT 3, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) 
);