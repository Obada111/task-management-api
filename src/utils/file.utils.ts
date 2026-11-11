
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { Task } from "../types/task.types";

const dataDir = join(process.cwd(), "data");
const filePath = join(dataDir, "tasks.json");


export async function readTasks(): Promise<Task[]> {
    const data = await readFile(filePath, "utf-8");

    if (data.trim() === "") {
        return [];
    }

    let tasks: unknown;

    try {
        tasks = JSON.parse(data);
    } catch {
        throw new Error("Invalid JSON in tasks.json");
    }

    if (!Array.isArray(tasks)) {
        throw new Error("Tasks data must be an array");
    }

    return tasks as Task[];
}


export async function writeTasks(tasks: Task[]): Promise<void> {
    const data = JSON.stringify(tasks, null, 2);

    await writeFile(filePath, data, "utf-8");
}
