# Database Documentation

### Overview

This folder, `models`, contains a series of SQL files that define the structure and relationships of the database used by this backend. These files are essential for understanding the database schema, which is a prerequisite for the application's proper operation.

### Important

This backend is designed to be used with a Postgres Database. If you prefer to use it with a different relational database, you can adapt the queries to suit your preferred database management system.

### SQL Files Description

Each file in this directory provides the SQL commands needed to create and manage different aspects of the database:

1. `work_items`
    * This table stores information about work items.
    * It includes details such as priority, status, assignee, due date, and auxiliary information from external sources.
2. `users`
    * This table stores user information, including email, username, name, hashed password, and account creation/login details.
3. `user_teams`
    * This table represents the many-to-many relationship between users and teams.
    * It stores information about a user's role and approval status within a specific team.
4. `teams`
    * This table stores information about teams, including their name, description, creator, owner, and approval status.
5. `roles`
    * This table defines the different roles available in the system, along with their corresponding authority levels.

### Database Schema

[Loading...]

### Usage

To set up the database, follow these steps:

1. Open psql or pgAdmin: Connect to your PostgreSQL database.
2. Create a database that will host the required tables.
3. Create a `.env` file and follow the instructions from the `.env.example` file to connect to your database. 
4. Follow the steps from the next section (Order of Operations) to create the required tables.

### Order of Operations

Before running the following queries, ensure that each script is executed in a PostgreSQL environment where your database has already been created.

1. Create all the types from `postgres_types.sql` file.
2. Create the table and insert the values from `roles.sql` file.
3. Create the table from the `users.sql` file.
4. Create the table from the `teams.sql` file but don't insert the values just yet.
5. Create the table from the `user_teams.sql` file but don't insert the values just yet.
6. Create the table from the `work_items.sql` file.
7. Register the first user with the role `dev`.
    - Start the Express server using `npm run dev`.
    - Start the React application using `npm run dev`.
    - Be sure to update the CORS whitelist from `/Express-JWT-bcrypt-PostgreSQL/config/corsOptions.js` if needed.
    - Be sure to update the `BASE_URL` from `/React-Redux-Axios/src/api/config.js` if needed.
8. Insert the values from the `teams.sql` file.
9. Insert the values from the `user_teams.sql` file.
10. Run the following command: `SELECT setval('teams_id_seq', (SELECT MAX(id) FROM teams) + 1)`. More details in `teams.sql` file.

[Loading...];

### Notes

-   These SQL files should be reviewed and tested in a development environment before being applied to a production database.
-   Adjustments might be necessary depending on the specific SQL dialect used and the database configuration.

Andrei-Boghiu,
Happy Hacking!