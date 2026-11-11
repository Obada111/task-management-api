import type { Request, Response, NextFunction } from "express";

export function validateTask(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
        res.status(400).json({ success: false, message: "Request body is required" });
        return;
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (req.method === "POST" && title === undefined) {
        res.status(400).json({ success: false, message: "Title is required" });
        return;
    }

    if (req.method === "PATCH" && status === undefined) {
        res.status(400).json({ success: false, message: "Status is required" });
        return;
    }

    if (req.method === "PUT" && Object.keys(req.body).length === 0) {
        res.status(400).json({ success: false, message: "Send at least one field to update" });
        return;
    }

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            res.status(400).json({ success: false, message: "Title must be a non-empty text" });
            return;
        }
        if (title.length > 120) {
            res.status(400).json({ success: false, message: "Title must be at most 120 characters" });
            return;
        }
    }

    if (description !== undefined) {
        if (typeof description !== "string" || description.length > 1000) {
            res.status(400).json({ success: false, message: "Description must be a text of at most 1000 characters" });
            return;
        }
    }

    if (status !== undefined && !["pending", "in-progress", "completed"].includes(status)) {
        res.status(400).json({ success: false, message: "Invalid status" });
        return;
    }

    if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
        res.status(400).json({ success: false, message: "Invalid priority" });
        return;
    }

    if (dueDate !== undefined && dueDate !== null) {
        if (typeof dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || isNaN(Date.parse(dueDate))) {
            res.status(400).json({ success: false, message: "dueDate must be a valid date like 2026-12-31" });
            return;
        }
    }

    next();
}