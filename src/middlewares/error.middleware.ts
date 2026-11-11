
import { RequestHandler, ErrorRequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        success: false,
        message: "Server error"
    });
};
