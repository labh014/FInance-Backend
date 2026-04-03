# Finance Dashboard Backend 🚀

Hey there! Welcome to my backend system for the Finance Dashboard project. I built this robust API to handle managing and visualizing financial transactions securely.

## 1. Project Overview
This is a complete backend platform for a finance dashboard that features a solid Role-Based Access Control (RBAC) system. It’s designed to be clean, scalable, and secure, powering everything from user authentication to complex financial aggregations.

## 2. Tech Stack
I chose a modern JavaScript stack for this project:
- **Node.js**: The core runtime environment.
- **Express**: To handle routing and middleware efficiently.
- **Prisma**: An awesome ORM for interacting with the database cleanly.
- **PostgreSQL**: The relational database used to store users and financial records. *(Note: The local environment uses SQLite for quick setup and testing!)*
- **Zod**: For strict and safe payload validation.

## 3. Features
Here are the main features I implemented:
- **Auth (JWT)**: Secure user login and registration flows using JSON Web Tokens.
- **Role-based access (RBAC)**: Defined permissions for different user levels (`VIEWER`, `ANALYST`, and `ADMIN`).
- **Financial records CRUD**: Full create, read, update, and delete capabilities with pagination and filtering baked in.
- **Dashboard analytics**: Endpoints that aggregate data to show total summaries, spending categories, and monthly trends.
- **Security**: Added global error handling, data validation with Zod, and rate-limiting to protect the APIs.

## 4. API Endpoints

### Auth / Users
- `POST /api/users/register` - Create a new user account.
- `POST /api/users/login` - Authenticate and get a JWT token.
- `GET /api/users/` - List all users.

### Financial Records
- `POST /api/records/` - Add a new income or expense record.
- `GET /api/records/` - Fetch historical records (supports pagination and filtering).
- `PUT /api/records/:id` - Update an existing record.
- `DELETE /api/records/:id` - Soft delete a record.

### Dashboard Analytics
- `GET /api/dashboard/summary` - Get total income, total expense, and net balance.
- `GET /api/dashboard/categories` - Get aggregated amounts grouped by specific categories.
- `GET /api/dashboard/trends` - Get historical monthly volume trends.

## 5. Setup Steps
Want to run this locally? Just follow these simple steps:

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Run the database migrations to set up the schema:
   ```bash
   npx prisma migrate dev
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 6. Assumptions
While building this, I made a few core assumptions based on standard product flows:
- **Data Isolation**: One user owns their own isolated records, and cannot fetch or modify records belonging to other users.
- **User Roles**: Roles are predefined (`VIEWER`, `ANALYST`, `ADMIN`) and are handled securely via backend middleware logic.
