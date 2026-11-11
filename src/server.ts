import "dotenv/config";
import app from "./app";

async function startServer(): Promise<void> {
    try {
        const PORT = Number(process.env.PORT) || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();