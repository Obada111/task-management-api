
import type { Request, Response } from "express";

import {
    createTask as svcCreateTask,
    getAllTasks as svcGetAllTasks,
    getTaskById as svcGetTaskById,
    updateTask as svcUpdateTask,
    updateTaskStatus as svcUpdateTaskStatus,
    deleteTask as svcDeleteTask,
    getTaskStats as svcGetTaskStats
} from "../services/task.service";

import type {
    CreateTaskInput,
    UpdateTaskInput,
    TaskQuery,
    TaskStatus
} from "../types/task.types";


export async function createTaskController(req: Request, res: Response): Promise<void> {
    try {
        const input = req.body as CreateTaskInput;

        const task = await svcCreateTask(input);

        res.status(201).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export async function getAllTasksController(req: Request, res: Response): Promise<void> {
    try {
        const query: TaskQuery = {
            status: typeof req.query.status === "string"
                ? req.query.status as TaskQuery["status"] : undefined,

            priority: typeof req.query.priority === "string"
                ? req.query.priority as TaskQuery["priority"] : undefined,

            search: typeof req.query.search === "string"
                ? req.query.search : undefined,

            sortBy: typeof req.query.sortBy === "string"
                ? req.query.sortBy as TaskQuery["sortBy"] : undefined,

            order: typeof req.query.order === "string"
                ? req.query.order as TaskQuery["order"] : undefined,

            page: typeof req.query.page === "string"
                ? Number(req.query.page) : undefined,

            limit: typeof req.query.limit === "string"
                ? Number(req.query.limit) : undefined
        };

        const result = await svcGetAllTasks(query);

        res.status(200).json({
            success: true,
            data: result.tasks,
            pagination: result.pagination
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export async function getTaskByIdController(req: Request, res: Response): Promise<void> {
    try {
        const id = String(req.params.id);

        const task = await svcGetTaskById(id);

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export async function updateTaskController(req: Request, res: Response): Promise<void> {
    try {
        const id = String(req.params.id);
        const input = req.body as UpdateTaskInput;

        const task = await svcUpdateTask(id, input);

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export async function updateTaskStatusController(req: Request, res: Response): Promise<void> {
    try {
        const id = String(req.params.id);
        const status = req.body.status as TaskStatus;

        const task = await svcUpdateTaskStatus(id, status);

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export async function deleteTaskController(req: Request, res: Response): Promise<void> {
    try {
        const id = String(req.params.id);

        const deleted = await svcDeleteTask(id);

        if (!deleted) {
            res.status(404).json({
                success: false,
                message: "Task not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


export async function getTaskStatsController(req: Request, res: Response): Promise<void> {
    try {
        const stats = await svcGetTaskStats();

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getTasks = getAllTasksController;
export const createTask = createTaskController;
export const getTaskById = getTaskByIdController;
export const updateTask = updateTaskController;
export const updateTaskStatus = updateTaskStatusController;
export const deleteTask = deleteTaskController;
export const getTaskStats = getTaskStatsController;
