CREATE TYPE work_item_status AS ENUM('Unassigned', 'Work in Progress', 'Resolved', 'Reopened', 'Pending', 'Removed');
CREATE TYPE work_item_resolution AS ENUM()