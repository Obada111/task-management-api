
import {
    body,
    query,
    validationResult
} from "express-validator";

import type { RequestHandler } from "express";


// Check allowed body fields
export function checkBodyFields(
    allowedFields: string[],
    requireAtLeastOne = false
): RequestHandler {

    return (req, res, next) => {

        if (
            typeof req.body !== "object" ||
            req.body === null ||
            Array.isArray(req.body)
        ) {
            res.status(400).json({
                success: false,
                message: "Request body must be a JSON object"
            });
            return;
        }

        const fields = Object.keys(req.body);

        const unknownFields = fields.filter(
            field => !allowedFields.includes(field)
        );

        if (unknownFields.length > 0) {
            res.status(400).json({
                success: false,
                message: "Unknown fields",
                errors: unknownFields
            });
            return;
        }

        if (requireAtLeastOne && fields.length === 0) {
            res.status(400).json({
                success: false,
                message: "Update body cannot be empty"
            });
            return;
        }

        next();
    };
}


// Collect validation errors
export const validate: RequestHandler = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
        return;
    }

    next();
};


// CREATE TASK VALIDATION
export const createTaskRules = [

    body("title")
        .exists().withMessage("Title is required")
        .bail()
        .isString().withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty().withMessage("Title cannot be empty")
        .bail()
        .isLength({ max: 120 })
        .withMessage("Title cannot exceed 120 characters"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .bail()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority"),

    body("dueDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must follow YYYY-MM-DD")
        .bail()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("Invalid date")
];


// UPDATE TASK VALIDATION
export const updateTaskRules = [

    body("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty().withMessage("Title cannot be empty")
        .bail()
        .isLength({ max: 120 })
        .withMessage("Title cannot exceed 120 characters"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .bail()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority"),

    body("dueDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must follow YYYY-MM-DD")
        .bail()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("Invalid date")
];


// UPDATE STATUS VALIDATION
export const updateStatusRules = [

    body("status")
        .exists().withMessage("Status is required")
        .bail()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status")
];


// QUERY VALIDATION
export const taskQueryRules = [

    query("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status filter"),

    query("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority filter"),

    query("search")
        .optional()
        .isString()
        .withMessage("Search must be a string"),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "dueDate", "priority", "title"])
        .withMessage("Invalid sort field"),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order must be asc or desc"),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),

    query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer")
];
