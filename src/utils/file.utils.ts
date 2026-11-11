import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Task } from "../types/task.types";

const filePath = join(process.cwd(), "data", "tasks.json");

export async function readTasks(): Promise<Task[]> {
    const data = await readFile(filePath, "utf-8");

    if (data.trim() === "") {
        return [];
    }

    return JSON.parse(data);
}

export async function writeTasks(tasks: Task[]): Promise<void> {
    await writeFile(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}