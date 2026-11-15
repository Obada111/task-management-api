# Task Management API

A simple REST API for managing tasks, built with Node.js, Express and TypeScript. Tasks are stored in a MySQL database and accessed through TypeORM.

## Features

- Create, read, update and delete tasks
- Change only the status of a task
- Filter tasks by status and priority
- Search tasks by title or description
- Sort tasks and use pagination
- Task statistics (count by status and priority)
- Input validation with simple `if` checks
- Error handling for unknown routes and server errors

## Technologies

- Node.js
- Express
- TypeScript
- MySQL
- TypeORM
- mysql2
- dotenv (for environment configuration)
- nodemon and ts-node (for development)

## Project Structure

```
Task-managment-api/
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
├── package.json
└── tsconfig.json
```

| Path | Job |
| --- | --- |
| `routes` | Connects each URL to a controller function |
| `middlewares` | Validates input and handles errors |
| `controllers` | Receives the request and sends the response |
| `services` | Contains the task logic and uses the TypeORM repository |
| `entities` | Maps TypeScript classes to the `tasks` table |
| `migrations` | Creates and updates the database schema |
| `types` | TypeScript types for tasks |
| `data-source.ts` | Configures the MySQL DataSource |
| `server.ts` | Initializes the database before starting the server |
| `test-db.ts` | Optional standalone database connection test |

## Getting Started

### 1. Clone the project

```bash
git clone <your-repository-url>
cd Task-managment-api
```

### 2. Install the packages

```bash
npm install
```

### 3. Configure the environment

Copy `.env.example` to `.env` and fill in your local values:

```
NODE_ENV=development
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=task_management
```

`.env` is ignored by Git. Never commit real credentials.

### 4. Create the database

In DBeaver or any MySQL client, create the database if it does not exist:

```sql
CREATE DATABASE IF NOT EXISTS task_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 5. Run the migrations

```bash
npm run typeorm -- migration:run -d src/data-source.ts
```

### 6. Run the project

```bash
npm run dev
```

You should see:

```
Database connected
Server running on port 3000
```

### Optional: test the database connection

```bash
npx ts-node src/test-db.ts
```

It prints `Connected` when the database is reachable.

### Other commands

```bash
npm run typecheck
```

Checks the TypeScript code for errors without running it.

```bash
npm run build
npm start
```

Builds the project to `dist/` and runs the compiled server.

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Check that the server is running |
| GET | `/api/tasks` | Get all tasks (with filter, search, sort, pagination) |
| GET | `/api/tasks/stats` | Get task statistics |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update only the status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Task fields

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `title` | string | Yes (on create) | 1 to 120 characters |
| `description` | string | No | Maximum 1000 characters |
| `status` | string | No | `pending`, `in-progress` or `completed` (default `pending`) |
| `priority` | string | No | `low`, `medium` or `high` (default `medium`) |
| `dueDate` | string | No | Format `YYYY-MM-DD`, for example `2026-12-31` (send `null` on update to remove it) |

The server also adds `id`, `createdAt` and `updatedAt` automatically.

### Query parameters for `GET /api/tasks`

| Parameter | Description | Example |
| --- | --- | --- |
| `status` | Filter by status | `?status=pending` |
| `priority` | Filter by priority | `?priority=high` |
| `search` | Search in title and description | `?search=express` |
| `sortBy` | `createdAt`, `dueDate`, `priority` or `title` (default `createdAt`) | `?sortBy=priority` |
| `order` | `asc` or `desc` (default `desc`) | `?order=asc` |
| `page` | Page number (default 1) | `?page=2` |
| `limit` | Tasks per page (default 10, maximum 100) | `?limit=5` |

You can combine them:

```
GET /api/tasks?status=pending&sortBy=priority&order=asc&page=1&limit=5
```

## Examples

### Create a task

```
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn Express",
  "description": "Finish the routing chapter",
  "priority": "high",
  "dueDate": "2026-12-31"
}
```

Response (status 201):

```json
{
  "success": true,
  "data": {
    "id": "ba7ac546-194a-4220-8ac1-254580d242b4",
    "title": "Learn Express",
    "description": "Finish the routing chapter",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-12-31",
    "createdAt": "2026-11-11T18:57:05.680Z",
    "updatedAt": "2026-11-11T18:57:05.680Z"
  }
}
```

### Update only the status

```
PATCH /api/tasks/ba7ac546-194a-4220-8ac1-254580d242b4/status
Content-Type: application/json

{
  "status": "completed"
}
```

### Get statistics

```
GET /api/tasks/stats
```

```json
{
  "success": true,
  "data": {
    "total": 2,
    "byStatus": { "pending": 1, "in-progress": 0, "completed": 1 },
    "byPriority": { "low": 1, "medium": 0, "high": 1 }
  }
}
```

### Test with PowerShell

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType "application/json" -Body '{"title":"Learn Express","priority":"high"}'
```

### Test with curl

```bash
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Learn Express","priority":"high"}'
```

## Response Format

Every response has a `success` field.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Title is required"
}
```

| Status code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Task created |
| 400 | Invalid input |
| 404 | Task or route not found |
| 500 | Server error |

## Validation Rules

- `POST /api/tasks`: `title` is required
- `PUT /api/tasks/:id`: send at least one field
- `PATCH /api/tasks/:id/status`: `status` is required
- `title` must be a non-empty text with a maximum of 120 characters
- `description` must be a text with a maximum of 1000 characters
- `status` must be `pending`, `in-progress` or `completed`
- `priority` must be `low`, `medium` or `high`
- `dueDate` must be a real date in the format `YYYY-MM-DD`

## Author

Obada Joba
