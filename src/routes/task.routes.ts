import { Router } from "express";
import { body, query } from "express-validator";
import * as taskController from "../controllers/task.controller";
import { validate } from "../middlewares/validate.middleware";

const router = Router();

const statuses = ["pending", "in-progress", "completed"];
const priorities = ["low", "medium", "high"];
const sortFields = ["createdAt", "dueDate", "priority", "title"];
const orders = ["asc", "desc"];
const updateFields = ["title", "description", "status", "priority", "dueDate"];

const dueDateValidation = body("dueDate")
    .optional({ values: "null" })
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("dueDate must be in YYYY-MM-DD format")
    .custom((value) => {
        if (Number.isNaN(Date.parse(value))) {
            throw new Error("dueDate must be a valid date");
        }
        return true;
    });

const optionalFieldsValidation = [
    body("description")
        .optional()
        .isString()
        .withMessage("description must be a string")
        .trim()
        .isLength({ max: 1000 })
        .withMessage("description must be at most 1000 characters"),
    body("status")
        .optional()
        .isIn(statuses)
        .withMessage(`status must be one of: ${statuses.join(", ")}`),
    body("priority")
        .optional()
        .isIn(priorities)
        .withMessage(`priority must be one of: ${priorities.join(", ")}`),
    dueDateValidation
];

const updateBodyValidation = body().custom((value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error("Request body must be a JSON object");
    }

    const keys = Object.keys(value);

    if (keys.length === 0) {
        throw new Error("Request body cannot be empty");
    }

    const hasValidField = keys.some((key) => updateFields.includes(key));

    if (!hasValidField) {
        throw new Error(`Provide at least one of: ${updateFields.join(", ")}`);
    }

    return true;
});

router.get("/stats", taskController.getTaskStats);

router.get(
    "/",
    query("status")
        .optional()
        .isIn(statuses)
        .withMessage(`status must be one of: ${statuses.join(", ")}`),
    query("priority")
        .optional()
        .isIn(priorities)
        .withMessage(`priority must be one of: ${priorities.join(", ")}`),
    query("search")
        .optional()
        .isString()
        .withMessage("search must be a string"),
    query("sortBy")
        .optional()
        .isIn(sortFields)
        .withMessage(`sortBy must be one of: ${sortFields.join(", ")}`),
    query("order")
        .optional()
        .isIn(orders)
        .withMessage(`order must be one of: ${orders.join(", ")}`),
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("limit must be an integer between 1 and 100"),
    validate,
    taskController.getTasks
);

router.post(
    "/",
    body("title")
        .exists()
        .withMessage("title is required")
        .isString()
        .withMessage("title must be a string")
        .trim()
        .isLength({ min: 1, max: 120 })
        .withMessage("title must be between 1 and 120 characters"),
    ...optionalFieldsValidation,
    validate,
    taskController.createTask
);

router.get("/:id", taskController.getTaskById);

router.put(
    "/:id",
    updateBodyValidation,
    body("title")
        .optional()
        .isString()
        .withMessage("title must be a string")
        .trim()
        .isLength({ min: 1, max: 120 })
        .withMessage("title must be between 1 and 120 characters"),
    ...optionalFieldsValidation,
    validate,
    taskController.updateTask
);

router.patch(
    "/:id/status",
    body("status")
        .exists()
        .withMessage("status is required")
        .isIn(statuses)
        .withMessage(`status must be one of: ${statuses.join(", ")}`),
    validate,
    taskController.updateTaskStatus
);

router.delete("/:id", taskController.deleteTask);

export default router;
