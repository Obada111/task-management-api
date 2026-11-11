
import { body, query, validationResult } from "express-validator";
import { RequestHandler } from "express";

export const checkBodyFields = (
    allowedFields: string[],
    requireAtLeastOne = false
): RequestHandler => {
    return (req, res, next) => {
        const fields = Object.keys(req.body || {});

        const hasInvalidField = fields.some(
            field => !allowedFields.includes(field)
        );

        if (hasInvalidField) {
            res.status(400).json({
                success: false,
                message: "Invalid fields"
            });
            return;
        }

        if (requireAtLeastOne && fields.length === 0) {
            res.status(400).json({
                success: false,
                message: "Request body cannot be empty"
            });
            return;
        }

        next();
    };
};

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

export const createTaskRules = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isString().withMessage("Title must be a string")
        .bail()
        .trim()
        .isLength({ max: 120 }).withMessage("Title is too long"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .isLength({ max: 1000 }).withMessage("Description is too long"),

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
        .withMessage("Invalid date format")
];

export const updateTaskRules = [
    body("title")
        .optional()
        .isString().withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty().withMessage("Title cannot be empty")
        .isLength({ max: 120 }).withMessage("Title is too long"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string")
        .isLength({ max: 1000 }).withMessage("Description is too long"),

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
        .withMessage("Invalid date format")
];

export const updateStatusRules = [
    body("status")
        .notEmpty().withMessage("Status is required")
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status")
];

export const taskQueryRules = [
    query("status")
        .optional()
        .isIn(["pending", "in-progress", "completed"])
        .withMessage("Invalid status"),

    query("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority"),

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
        .withMessage("Invalid order"),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid page"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Invalid limit")
];
