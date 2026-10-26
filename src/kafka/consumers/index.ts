import { Consumer } from "kafkajs";
import { config } from "../../config/config";
import { logger } from "../../utils/logger";
import { createKafkaConsumer } from "../kafka.client";
import {
  DriverAssignedEvent,
  KAFKA_TOPICS,
  OrderCreatedEvent,
} from "../topics";
import { handleOrderCreatedForDriver } from "./driver.consumer";
import {
  handleDriverAssignedForNotification,
  handleOrderCreatedForNotification,
} from "./notification.consumer";
import { handleOrderCreatedForPayment } from "./payment.consumer";

let consumer: Consumer | null = null;

export const startAllConsumers = async (): Promise<void> => {
  if (!config.KAFKA_ENABLED) {
    logger.warn(
      "Kafka is disabled via KAFKA_ENABLED=false. Skipping consumers startup.",
    );
    return;
  }

  try {
    consumer = createKafkaConsumer(config.KAFKA_GROUP_ID);

    await consumer.connect();
    logger.info(
      `[Kafka Consumer] Connected to group: ${config.KAFKA_GROUP_ID}`,
    );

    // Subscribe to all relevant topics
    await consumer.subscribe({
      topic: KAFKA_TOPICS.ORDER_CREATED,
      fromBeginning: false,
    });
    await consumer.subscribe({
      topic: KAFKA_TOPICS.DRIVER_ASSIGNED,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        try {
          const rawValue = message.value.toString();
          const parsedData = JSON.parse(rawValue);

          logger.info(
            `[Kafka Consumer] Received message on topic [${topic}] (partition: ${partition})`,
          );

          if (topic === KAFKA_TOPICS.ORDER_CREATED) {
            const event = parsedData as OrderCreatedEvent;
            // Jalankan task-task microservices secara paralel
            await Promise.allSettled([
              handleOrderCreatedForPayment(event),
              handleOrderCreatedForDriver(event),
              handleOrderCreatedForNotification(event),
            ]);
          } else if (topic === KAFKA_TOPICS.DRIVER_ASSIGNED) {
            const event = parsedData as DriverAssignedEvent;
            await handleDriverAssignedForNotification(event);
          }
        } catch (msgErr: any) {
          logger.error(
            new Error(
              `[Kafka Consumer] Error processing message on [${topic}]: ${msgErr.message}`,
            ),
          );
        }
      },
    });

    logger.info(
      `[Kafka Consumer] Listening to topics: [${KAFKA_TOPICS.ORDER_CREATED}, ${KAFKA_TOPICS.DRIVER_ASSIGNED}]`,
    );
  } catch (error: any) {
    logger.error(
      new Error(
        `[Kafka Consumer] Failed to start consumers: ${error.message}. Continuing server startup.`,
      ),
    );
  }
};

export const stopAllConsumers = async (): Promise<void> => {
  if (consumer) {
    try {
      await consumer.disconnect();
      logger.info("[Kafka Consumer] Disconnected gracefully");
    } catch (err: any) {
      logger.warn(`Error disconnecting Kafka Consumer: ${err.message}`);
    }
  }
};
