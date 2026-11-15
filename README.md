# Task Management API

A RESTful API for managing tasks, built with Node.js, Express, TypeScript, MySQL, and TypeORM.

The application supports task management, filtering, searching, sorting, pagination, and task statistics, with persistent data storage in MySQL.

## Features

- Create, read, update, and delete tasks (CRUD).
- Update task status independently.
- Filter tasks by status and priority.
- Search tasks by title or description.
- Sort tasks by creation date, due date, priority, or title.
- Paginate task results.
- Get task statistics by status and priority.
- Request validation using Express middleware.
- Centralized error handling.
- Persistent database storage using MySQL and TypeORM.

## Technologies

- Node.js
- Express.js
- TypeScript
- MySQL
- TypeORM
- mysql2
- dotenv
- nodemon
- ts-node

## Project Structure

```text
task-management-api/
├── src/
│   ├── controllers/
│   │   └── task.controller.ts
│   ├── entities/
│   │   └── Task.ts
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── migrations/
│   │   └── 1794754007655-CreateTasksTable.ts
│   ├── routes/
│   │   └── task.routes.ts
│   ├── services/
│   │   └── task.service.ts
│   ├── types/
│   │   └── task.types.ts
│   ├── app.ts
│   ├── data-source.ts
│   ├── server.ts
│   └── test-db.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

| Directory / File | Description |
|---|---|
| `routes` | Defines API endpoints and connects them to controllers |
| `controllers` | Handles HTTP requests and responses |
| `services` | Contains business logic and database operations |
| `entities` | Defines database entities and table mappings |
| `middlewares` | Handles request validation and errors |
| `migrations` | Manages database schema changes |
| `types` | Contains TypeScript interfaces and types |
| `data-source.ts` | Configures the TypeORM MySQL connection |
| `server.ts` | Initializes the database before starting Express |
| `test-db.ts` | Provides a standalone database connection test |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Obada111/task-management-api.git

cd task-management-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```env
NODE_ENV=development
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=task_management
```

Update the values according to your local MySQL configuration.

**Important:** Never commit your actual `.env` file or expose database credentials.

### 4. Create the database

Create the database using MySQL or a database management tool such as DBeaver.

```sql
CREATE DATABASE IF NOT EXISTS task_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 5. Run database migrations

Execute the migration to create the required database tables:

```bash
npm run typeorm -- migration:run -d src/data-source.ts
```

### 6. Start the development server

```bash
npm run dev
```

The server should start successfully and display:

```text
Database connected
Server running on port 3000
```

The API is now available at:

```text
http://localhost:3000
```

### Optional: Test the database connection

```bash
npx ts-node src/test-db.ts
```

A successful connection prints:

```text
Connected
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server using nodemon |
| `npm run typecheck` | Checks TypeScript types without generating files |
| `npm run build` | Compiles TypeScript into JavaScript |
| `npm start` | Starts the compiled application |

## API Endpoints

Base URL:

```text
http://localhost:3000
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Checks server availability |
| GET | `/api/tasks` | Retrieves all tasks |
| GET | `/api/tasks/stats` | Retrieves task statistics |
| GET | `/api/tasks/:id` | Retrieves a task by ID |
| POST | `/api/tasks` | Creates a new task |
| PUT | `/api/tasks/:id` | Updates a task |
| PATCH | `/api/tasks/:id/status` | Updates task status |
| DELETE | `/api/tasks/:id` | Deletes a task |

## Task Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | UUID | Automatically generated | Unique task identifier |
| `title` | string | Yes (on create) | Task title (1–120 characters) |
| `description` | string | No | Task description (maximum 1000 characters) |
| `status` | string | No | `pending`, `in-progress`, or `completed` |
| `priority` | string | No | `low`, `medium`, or `high` |
| `dueDate` | string | No | Due date in `YYYY-MM-DD` format |
| `createdAt` | datetime | Automatically generated | Task creation timestamp |
| `updatedAt` | datetime | Automatically updated | Last modification timestamp |

Default values:

- `status`: `pending`
- `priority`: `medium`

## Query Parameters

The `GET /api/tasks` endpoint supports the following query parameters:

| Parameter | Description | Example |
|---|---|---|
| `status` | Filter by task status | `?status=pending` |
| `priority` | Filter by task priority | `?priority=high` |
| `search` | Search by title or description | `?search=express` |
| `sortBy` | Sort by `createdAt`, `dueDate`, `priority`, or `title` | `?sortBy=priority` |
| `order` | Sorting order: `asc` or `desc` | `?order=asc` |
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Number of tasks per page (default: 10, maximum: 100) | `?limit=5` |

Parameters can be combined:

```http
GET /api/tasks?status=pending&priority=high&sortBy=priority&order=asc&page=1&limit=5
```

## Request Examples

### 1. Create a Task

**Request**

```http
POST /api/tasks
Content-Type: application/json
```

**Body**

```json
{
  "title": "Learn TypeORM",
  "description": "Practice database operations",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-12-31"
}
```

**Response — 201 Created**

```json
{
  "success": true,
  "data": {
    "id": "ba7ac546-194a-4220-8ac1-254580d242b4",
    "title": "Learn TypeORM",
    "description": "Practice database operations",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-12-31",
    "createdAt": "2026-11-11T18:57:05.680Z",
    "updatedAt": "2026-11-11T18:57:05.680Z"
  }
}
```

### 2. Get All Tasks

```http
GET /api/tasks
```

### 3. Get a Task by ID

```http
GET /api/tasks/:id
```

### 4. Update a Task

```http
PUT /api/tasks/:id
Content-Type: application/json
```

```json
{
  "title": "Learn TypeORM and MySQL",
  "priority": "medium"
}
```

### 5. Update Task Status

```http
PATCH /api/tasks/:id/status
Content-Type: application/json
```

```json
{
  "status": "completed"
}
```

### 6. Delete a Task

```http
DELETE /api/tasks/:id
```

### 7. Get Task Statistics

```http
GET /api/tasks/stats
```

**Example Response**

```json
{
  "success": true,
  "data": {
    "total": 2,
    "byStatus": {
      "pending": 1,
      "in-progress": 0,
      "completed": 1
    },
    "byPriority": {
      "low": 1,
      "medium": 0,
      "high": 1
    }
  }
}
```

## Response Format

All API responses follow a consistent JSON structure.

**Success Response**

```json
{
  "success": true,
  "data": {}
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Title is required"
}
```

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request or validation error |
| 404 | Resource or route not found |
| 500 | Internal server error |

## Validation Rules

- `POST /api/tasks`: Title is required.
- `PUT /api/tasks/:id`: At least one field must be provided.
- `PATCH /api/tasks/:id/status`: Status is required.
- `title` must be a non-empty string with a maximum of 120 characters.
- `description` must be a string with a maximum of 1000 characters.
- `status` must be `pending`, `in-progress`, or `completed`.
- `priority` must be `low`, `medium`, or `high`.
- `dueDate` must be a valid date in `YYYY-MM-DD` format.

## Database Architecture

This project uses TypeORM as its Object-Relational Mapper (ORM) to interact with MySQL.

- **DataSource:** Manages the database connection.
- **Entities:** Map TypeScript classes to database tables.
- **Repositories:** Handle database operations.
- **QueryBuilder:** Builds database queries for filtering, searching, sorting, and pagination.
- **Migrations:** Manage database schema changes.

All task data is persisted in MySQL.

## Author
**Obada Joba**

GitHub: [@Obada111](https://github.com/Obada111)
