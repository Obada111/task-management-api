# Task Management API

A RESTful API for managing tasks, built with Node.js, Express, and TypeScript. Tasks are stored in a local JSON file using File-Based Storage.

## Features

- Create, read, update, and delete tasks (CRUD).
- Update task status independently.
- Filter tasks by status and priority.
- Search tasks by title or description.
- Sort tasks by creation date, due date, priority, or title.
- Paginate task results.
- Get task statistics by status and priority.
- Request validation using custom Express middleware.
- Centralized error handling for unknown routes and server errors.
- Persistent task storage using JSON files.

## Technologies

- Node.js
- Express.js
- TypeScript
- UUID (for task IDs)
- dotenv (for environment configuration)
- nodemon (for development)
- ts-node (for running TypeScript during development)

## Project Structure

```text
task-management-api/
├── data/
│   └── tasks.json
├── src/
│   ├── controllers/
│   │   └── task.controller.ts
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── routes/
│   │   └── task.routes.ts
│   ├── services/
│   │   └── task.service.ts
│   ├── types/
│   │   └── task.types.ts
│   ├── utils/
│   │   └── file.utils.ts
│   ├── app.ts
│   └── server.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

| Directory / File | Description |
|---|---|
| `data` | Stores tasks in a JSON file |
| `routes` | Defines API endpoints and connects them to controllers |
| `middlewares` | Handles request validation and errors |
| `controllers` | Handles HTTP requests and responses |
| `services` | Contains task business logic and operations |
| `utils` | Provides functions for reading and writing JSON files |
| `types` | Contains TypeScript interfaces and types |
| `app.ts` | Configures the Express application |
| `server.ts` | Starts the HTTP server |

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

### 3. Prepare the data file

The application uses `data/tasks.json` to store tasks.

Make sure the file exists. If it does not, create it with the following content:

```json
[]
```

### 4. Configure the environment (Optional)

Create a `.env` file in the project root:

```env
PORT=3000
```

If no `PORT` is provided, the server uses port `3000` by default.

### 5. Run the development server

```bash
npm run dev
```

The server should display:

```text
Server running on port 3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server using nodemon and ts-node |
| `npm run typecheck` | Checks TypeScript types without generating output |
| `npm run build` | Compiles TypeScript into JavaScript |
| `npm start` | Runs the compiled application from the `dist` directory |

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
| PATCH | `/api/tasks/:id/status` | Updates only the task status |
| DELETE | `/api/tasks/:id` | Deletes a task |

## Task Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string (UUID) | Automatically generated | Unique task identifier |
| `title` | string | Yes (on create) | Task title (1–120 characters) |
| `description` | string | No | Task description (maximum 1000 characters) |
| `status` | string | No | `pending`, `in-progress`, or `completed` |
| `priority` | string | No | `low`, `medium`, or `high` |
| `dueDate` | string | No | Due date in `YYYY-MM-DD` format |
| `createdAt` | string | Automatically generated | Task creation timestamp |
| `updatedAt` | string | Automatically updated | Last modification timestamp |

Default values:

- `status`: `pending`
- `priority`: `medium`

## Query Parameters

The `GET /api/tasks` endpoint supports the following query parameters:

| Parameter | Description | Example |
|---|---|---|
| `status` | Filter tasks by status | `?status=pending` |
| `priority` | Filter tasks by priority | `?priority=high` |
| `search` | Search by title or description | `?search=express` |
| `sortBy` | Sort by `createdAt`, `dueDate`, `priority`, or `title` | `?sortBy=priority` |
| `order` | Sorting order: `asc` or `desc` | `?order=asc` |
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Tasks per page (default: 10, maximum: 100) | `?limit=5` |

You can combine multiple query parameters:

```http
GET /api/tasks?status=pending&priority=high&sortBy=priority&order=asc&page=1&limit=5
```

## Request Examples

### 1. Create a Task

**Request:**

```http
POST /api/tasks
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Learn Express",
  "description": "Finish the routing chapter",
  "priority": "high",
  "dueDate": "2026-12-31"
}
```

**Response — 201 Created:**

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

**Body:**

```json
{
  "title": "Learn Express and TypeScript",
  "priority": "medium"
}
```

### 5. Update Task Status

```http
PATCH /api/tasks/:id/status
Content-Type: application/json
```

**Body:**

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

**Example Response:**

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

## Testing Examples

### PowerShell

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/tasks `
  -ContentType "application/json" `
  -Body '{"title":"Learn Express","priority":"high"}'
```

### cURL

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Express","priority":"high"}'
```

## Response Format

All API responses follow a consistent JSON structure.

**Success Response:**

```json
{
  "success": true,
  "data": {}
}
```

**Error Response:**

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
| 400 | Invalid input or validation error |
| 404 | Task or route not found |
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

## Author

**Obada Joba**

GitHub: [@Obada111](https://github.com/Obada111)
