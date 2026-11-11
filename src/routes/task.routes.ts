import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { validateTask } from "../middlewares/validate.middleware";

const router = Router();

router.get("/stats", taskController.getTaskStats);
router.get("/", taskController.getTasks);
router.post("/", validateTask, taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.put("/:id", validateTask, taskController.updateTask);
router.patch("/:id/status", validateTask, taskController.updateTaskStatus);
router.delete("/:id", taskController.deleteTask);

export default router;
