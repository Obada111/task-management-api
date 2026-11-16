import { v4 as uuidv4 } from "uuid";
import { readTasks, writeTasks } from "../utils/file.utils";
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskQuery,
    TaskListResult,
    TaskStats
} from "../types/task.types";

const priorityOrder: Record<Task["priority"], number> = {
    low: 1,
    medium: 2,
    high: 3
};

function compareTasks(a: Task, b: Task, sortBy: string): number {
    if (sortBy === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    if (sortBy === "title") {
        return a.title.localeCompare(b.title);
    }

    if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) {
            return 0;
        }
        if (!a.dueDate) {
            return 1;
        }
        if (!b.dueDate) {
            return -1;
        }
        return a.dueDate.localeCompare(b.dueDate);
    }

    return a.createdAt.localeCompare(b.createdAt);
}

export async function getAllTasks(query: TaskQuery): Promise<TaskListResult> {
    const tasks = await readTasks();

    let result = [...tasks];

    if (query.status) {
        result = result.filter((task) => task.status === query.status);
    }

    if (query.priority) {
        result = result.filter((task) => task.priority === query.priority);
    }

    if (query.search) {
        const search = query.search.toLowerCase();
        result = result.filter((task) =>
            task.title.toLowerCase().includes(search) ||
            (task.description ?? "").toLowerCase().includes(search)
        );
    }

    const sortBy = query.sortBy || "createdAt";
    const order = query.order || "desc";

    result.sort((a, b) => {
        const value = compareTasks(a, b, sortBy);
        return order === "asc" ? value : -value;
    });

    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
        tasks: result.slice(start, start + limit),
        pagination: { page, limit, total, totalPages }
    };
}

export async function getTaskById(id: string): Promise<Task | null> {
    const tasks = await readTasks();
    return tasks.find((task) => task.id === id) ?? null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
    const tasks = await readTasks();

    const now = new Date().toISOString();

    const newTask: Task = {
        id: uuidv4(),
        title: input.title.trim(),
        description: input.description?.trim() ?? "",
        status: input.status ?? "pending",
        priority: input.priority ?? "medium",
        ...(input.dueDate ? { dueDate: input.dueDate } : {}),
        createdAt: now,
        updatedAt: now
    };

    tasks.push(newTask);

    await writeTasks(tasks);

    return newTask;
}

export async function updateTask(
    id: string,
    input: UpdateTaskInput
): Promise<Task | null> {
    const tasks = await readTasks();

    const task = tasks.find((item) => item.id === id);

    if (!task) {
        return null;
    }

    if (input.title !== undefined) {
        task.title = input.title.trim();
    }

    if (input.description !== undefined) {
        task.description = input.description.trim();
    }

    if (input.status !== undefined) {
        task.status = input.status;
    }

    if (input.priority !== undefined) {
        task.priority = input.priority;
    }

    if (input.dueDate !== undefined) {
        if (input.dueDate === null) {
            delete task.dueDate;
        } else {
            task.dueDate = input.dueDate;
        }
    }

    task.updatedAt = new Date().toISOString();

    await writeTasks(tasks);

    return task;
}

export async function updateTaskStatus(
    id: string,
    status: Task["status"]
): Promise<Task | null> {
    return updateTask(id, { status });
}

export async function deleteTask(id: string): Promise<boolean> {
    const tasks = await readTasks();

    const index = tasks.findIndex((item) => item.id === id);

    if (index === -1) {
        return false;
    }

    tasks.splice(index, 1);

    await writeTasks(tasks);

    return true;
}

export async function getTaskStats(): Promise<TaskStats> {
    const tasks = await readTasks();

    const stats: TaskStats = {
        total: tasks.length,
        byStatus: {
            pending: 0,
            "in-progress": 0,
            completed: 0
        },
        byPriority: {
            low: 0,
            medium: 0,
            high: 0
        }
    };

    for (const task of tasks) {
        stats.byStatus[task.status] += 1;
        stats.byPriority[task.priority] += 1;
    }

    return stats;
}
