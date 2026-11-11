
import express from "express";

import taskRoutes from "./routes/task.routes";

import {
    notFoundHandler,
    errorHandler
} from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});

app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
