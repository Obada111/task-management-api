# Task Management API

A RESTful API for managing tasks, built with **Node.js, Express.js, and TypeScript**. The project supports creating, viewing, updating, deleting, filtering, and organizing tasks. Data is stored locally in a JSON file without using a database.

## Features

- Create, read, update, and delete tasks (CRUD).
- Update task status independently.
- Filter tasks by status and priority.
- Search tasks by title and description.
- Sort tasks by different fields.
- Paginate task results.
- Get task statistics.
- Basic request validation.
- Centralized error handling.
- Persistent data storage using a JSON file.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- JSON File Storage
- UUID
- dotenv
- CORS
- Morgan
- Nodemon

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
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Installation

Make sure you have Node.js 18 or newer and npm installed.

Clone the repository:

```bash
git clone https://github.com/Obada111/task-management-api.git
```

Navigate to the project directory:

```bash
cd task-management-api
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## Running the Project

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## API Endpoints

All task endpoints use the `/api/tasks` base path.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/stats` | Get task statistics |
| GET | `/api/tasks/:id` | Get a task by ID |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update task status |
| DELETE | `/api/tasks/:id` | Delete a task |

## Task Properties

| Property | Type | Description |
|---|---|---|
| id | String | Unique task ID |
| title | String | Task title |
| description | String | Task description |
| status | String | pending, in-progress, or completed |
| priority | String | low, medium, or high |
| dueDate | String | Task due date |
| createdAt | String | Creation date |
| updatedAt | String | Last update date |

## Query Parameters

The `GET /api/tasks` endpoint supports:

| Parameter | Description |
|---|---|
| status | Filter by task status |
| priority | Filter by priority |
| search | Search by title or description |
| sortBy | Sort by createdAt, dueDate, priority, or title |
| order | Sort order: asc or desc |
| page | Page number |
| limit | Number of tasks per page |

Example:

```text
GET /api/tasks?status=pending&priority=high&page=1&limit=10
```

## Example Request

Create a task:

**POST** `/api/tasks`

```json
{
  "title": "Learn Node.js",
  "description": "Build a REST API",
  "priority": "high",
  "dueDate": "2026-11-15"
}
```

## Testing

The API can be tested using **Postman**.

1. Start the development server.
2. Open Postman.
3. Create requests using the endpoints listed above.
4. Send requests and check their responses.

## Data Storage

Tasks are stored in `data/tasks.json`.

The project uses local JSON file storage instead of a database. This makes it suitable for learning and small development projects.

---

**Author:** Obada Joba

**GitHub:** [Obada111](https://github.com/Obada111)
