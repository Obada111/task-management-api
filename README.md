# Task Management API

A simple REST API for managing tasks, built with Node.js, Express and TypeScript. Tasks are saved in a JSON file, so no database is needed.

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
- uuid (for task ids)
- dotenv (for the PORT setting)
- nodemon and ts-node (for development)

## Project Structure

```
Task-managment-api/
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
└── tsconfig.json
```

| Folder | Job |
| --- | --- |
| `routes` | Connects each URL to a controller function |
| `middlewares` | Validates input and handles errors |
| `controllers` | Receives the request and sends the response |
| `services` | Contains the task logic (filter, sort, create, update, delete) |
| `utils` | Reads and writes the `tasks.json` file |
| `types` | TypeScript types for tasks |

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

### 3. Create the data file

The file `data/tasks.json` must exist. If it is missing, create it with this content:

```json
[]
```

### 4. Set the port (optional)

Create a `.env` file in the main folder:

```
PORT=3000
```

If there is no `.env` file, the server uses port 3000.

### 5. Run the project

```bash
npm run dev
```

You should see:

```
Server running on port 3000
```

### Other commands

```bash
npm run typecheck
```

Checks the TypeScript code for errors without running it.

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
