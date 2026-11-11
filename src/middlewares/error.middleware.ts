import type { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    res.status(500).json({
        success: false,
        message: "Server error"
    });
}