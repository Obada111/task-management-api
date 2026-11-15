import "reflect-metadata";
import "dotenv/config";
import app from "./app";
import { AppDataSource } from "./data-source";

const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(
      "Database connection failed:",
      error instanceof Error ? `${error.name}: ${error.message}` : error
    );
    process.exit(1);
  }
}

bootstrap();