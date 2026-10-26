import app from "./app";
import { config } from "./config/config";
import { startAllConsumers, stopAllConsumers } from "./kafka/consumers";
import { disconnectKafka, getKafkaProducer } from "./kafka/kafka.client";
import { logger } from "./utils/logger";

const PORT = config.PORT;

const server = app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(
    `🚀 [API Gateway] Ready at http://localhost:${PORT}/api/v1/health`,
  );

  // Initialize Kafka Producer for API Gateway
  if (config.KAFKA_ENABLED) {
    try {
      await getKafkaProducer();
      console.log(
        `📨 [API Gateway] Kafka Producer connected to ${config.KAFKA_BROKER}`,
      );

      // If enabled, run embedded workers (convenient for single-process local development)
      if (config.KAFKA_RUN_EMBEDDED_WORKERS) {
        await startAllConsumers();
        console.log(
          `⚙️  [Embedded Workers] Started background consumer workers`,
        );
      }
    } catch (err: any) {
      logger.warn(`Kafka initialization skipped or failed: ${err.message}`);
    }
  }
});

// Graceful shutdown
const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down API Gateway gracefully...`);
  server.close(async () => {
    if (config.KAFKA_RUN_EMBEDDED_WORKERS) {
      await stopAllConsumers();
    }
    await disconnectKafka();
    process.exit(0);
  });
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
