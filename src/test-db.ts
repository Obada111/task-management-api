import { AppDataSource } from "./data-source";
import "dotenv/config";

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Connected");
    await AppDataSource.destroy();
  } catch (error) {
    console.error(
      "Failed:",
      error instanceof Error ? `${error.name}: ${error.message}` : error,
    );
    process.exit(1);
  }
}

main();
