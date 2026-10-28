import "dotenv/config";
import {
  handleDriverAssignedForNotification,
  handleOrderCreatedForNotification,
  handleOrderStatusUpdatedForNotification,
  handlePaymentProcessedForNotification,
} from "../kafka/consumers/notification.consumer";
import { createKafkaConsumer } from "../kafka/kafka.client";
import {
  DriverAssignedEvent,
  KAFKA_TOPICS,
  OrderCreatedEvent,
  OrderStatusUpdatedEvent,
  PaymentProcessedEvent,
} from "../kafka/topics";
import { logger } from "../utils/logger";

const GROUP_ID = "notification-microservice-group";
const consumer = createKafkaConsumer(GROUP_ID);

export const runNotificationWorker = async () => {
  try {
    await consumer.connect();
    logger.info(
      `[Notification Worker] Connected to Kafka consumer group: ${GROUP_ID}`,
    );

    await consumer.subscribe({
      topic: KAFKA_TOPICS.ORDER_CREATED,
      fromBeginning: false,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.PAYMENT_PROCESSED,
      fromBeginning: false,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.DRIVER_ASSIGNED,
      fromBeginning: false,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.ORDER_STATUS_UPDATED,
      fromBeginning: false,
    });

    logger.info(
      `[Notification Worker] Subscribed to topics: ${KAFKA_TOPICS.ORDER_CREATED}, ${KAFKA_TOPICS.PAYMENT_PROCESSED}, ${KAFKA_TOPICS.DRIVER_ASSIGNED}, ${KAFKA_TOPICS.ORDER_STATUS_UPDATED}`,
    );
    console.log(
      `🔔 [Notification Microservice] Ready and listening for events...`,
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const raw = message.value.toString();
          const parsed = JSON.parse(raw);

          if (topic === KAFKA_TOPICS.ORDER_CREATED) {
            await handleOrderCreatedForNotification(
              parsed as OrderCreatedEvent,
            );
          } else if (topic === KAFKA_TOPICS.PAYMENT_PROCESSED) {
            await handlePaymentProcessedForNotification(
              parsed as PaymentProcessedEvent,
            );
          } else if (topic === KAFKA_TOPICS.DRIVER_ASSIGNED) {
            await handleDriverAssignedForNotification(
              parsed as DriverAssignedEvent,
            );
          } else if (topic === KAFKA_TOPICS.ORDER_STATUS_UPDATED) {
            await handleOrderStatusUpdatedForNotification(
              parsed as OrderStatusUpdatedEvent,
            );
          }
        } catch (err: any) {
          logger.error(
            new Error(
              `[Notification Worker] Error processing message: ${err.message}`,
            ),
          );
        }
      },
    });
  } catch (error: any) {
    logger.error(
      new Error(`[Notification Worker] Fatal startup error: ${error.message}`),
    );
    process.exit(1);
  }
};

const handleShutdown = async (signal: string) => {
  logger.info(
    `[Notification Worker] Received ${signal}. Shutting down gracefully...`,
  );
  try {
    await consumer.disconnect();
    logger.info("[Notification Worker] Consumer disconnected successfully");
  } catch (err: any) {
    logger.warn(
      `[Notification Worker] Error during disconnect: ${err.message}`,
    );
  }
  process.exit(0);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

// Start worker
runNotificationWorker();
