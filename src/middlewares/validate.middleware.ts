
import { RequestHandler } from "express";

export const validateTask: RequestHandler = (req, res, next) => {
    const { title, status, priority } = req.body;

    if (req.method === "POST" && !title) {
        res.status(400).json({
            success: false,
            message: "Title is required"
        });
        return;
    }

    if (status && !["pending", "in-progress", "completed"].includes(status)) {
        res.status(400).json({
            success: false,
            message: "Invalid status"
        });
        return;
    }

    if (priority && !["low", "medium", "high"].includes(priority)) {
        res.status(400).json({
            success: false,
            message: "Invalid priority"
        });
        return;
    }

    next();
};
