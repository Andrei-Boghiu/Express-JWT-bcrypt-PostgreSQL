CREATE TABLE work_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INTEGER,  -- Assuming this references a 'users' table
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- e.g., pending, in progress, completed
    priority INTEGER DEFAULT 3,  -- e.g., 1 for high, 2 for medium, 3 for low
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (assigned_to) REFERENCES users(id)  -- This line assumes you have a users table
);