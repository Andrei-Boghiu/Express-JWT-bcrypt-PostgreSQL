# Database Documentation

### Overview

This folder, `database`, contains a series of SQL files that define the structure and relationships of the database tables used by our backend. These files are crucial for understanding the database schema necessary for the proper functioning of the application.

### SQL Files Description

Each file in this directory provides the SQL commands needed to create and manage different aspects of the database:

-   `users.sql`: Contains the SQL statement for creating the users table. This file defines the table with columns for user IDs, emails, and hashed passwords, ensuring each user has a unique identifier and secure password storage.

[Loading...]

### Usage

To set up the database, follow these steps:

1. Open psql or pgAdmin: Connect to your PostgreSQL database.
2. Prepare SQL Command: Write a CREATE TABLE statement defining your table and columns.
3. Execute the SQL: Run the command in psql with `\i path/to/file.sql` or directly in pgAdmin.
4. Verify Creation: Check the table with `\dt` or `\d tableName` in psql.

[Loading...]

Ensure that each script is executed in a PostgreSQL environment where your database has already been created.

### Notes

-   These SQL files should be reviewed and tested in a development environment before being applied to a production database.
-   Adjustments might be necessary depending on the specific SQL dialect used and the database configuration.
