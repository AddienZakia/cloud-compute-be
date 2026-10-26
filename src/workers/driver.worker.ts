import "dotenv/config";
import { handleOrderCreatedForDriver } from "../kafka/consumers/driver.consumer";
import { createKafkaConsumer } from "../kafka/kafka.client";
import { KAFKA_TOPICS, OrderCreatedEvent } from "../kafka/topics";
import { logger } from "../utils/logger";

const GROUP_ID = "driver-microservice-group";
const consumer = createKafkaConsumer(GROUP_ID);

export const runDriverWorker = async () => {
  try {
    await consumer.connect();
    logger.info(
      `[Driver Worker] Connected to Kafka consumer group: ${GROUP_ID}`,
    );

    await consumer.subscribe({
      topic: KAFKA_TOPICS.ORDER_CREATED,
      fromBeginning: false,
    });

    logger.info(
      `[Driver Worker] Subscribed to topic: ${KAFKA_TOPICS.ORDER_CREATED}`,
    );
    console.log(
      `🚗 [Driver Microservice] Ready and listening to ${KAFKA_TOPICS.ORDER_CREATED}...`,
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const raw = message.value.toString();
          const event: OrderCreatedEvent = JSON.parse(raw);

          logger.info(
            `[Driver Worker] Processing OrderCreatedEvent for order: ${event.orderId} (partition: ${partition})`,
          );

          await handleOrderCreatedForDriver(event);
        } catch (err: any) {
          logger.error(
            new Error(
              `[Driver Worker] Error processing message: ${err.message}`,
            ),
          );
        }
      },
    });
  } catch (error: any) {
    logger.error(
      new Error(`[Driver Worker] Fatal startup error: ${error.message}`),
    );
    process.exit(1);
  }
};

const handleShutdown = async (signal: string) => {
  logger.info(
    `[Driver Worker] Received ${signal}. Shutting down gracefully...`,
  );
  try {
    await consumer.disconnect();
    logger.info("[Driver Worker] Consumer disconnected successfully");
  } catch (err: any) {
    logger.warn(`[Driver Worker] Error during disconnect: ${err.message}`);
  }
  process.exit(0);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

// Start worker
runDriverWorker();
