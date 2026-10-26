import { Consumer, Kafka, logLevel, Producer } from "kafkajs";
import { config } from "../config/config";
import { logger } from "../utils/logger";

const brokers = config.KAFKA_BROKER.split(",").map((b) => b.trim());

export const kafka = new Kafka({
  clientId: config.KAFKA_CLIENT_ID,
  brokers,
  logLevel: logLevel.WARN,

  retry: {
    initialRetryTime: 300,
    retries: 5,
  },
});

let producer: Producer | null = null;
let isProducerConnected = false;

export const getKafkaProducer = async (): Promise<Producer | null> => {
  if (!config.KAFKA_ENABLED) {
    logger.warn("Kafka is disabled via KAFKA_ENABLED=false");
    return null;
  }

  if (producer && isProducerConnected) {
    return producer;
  }

  try {
    if (!producer) {
      producer = kafka.producer({
        allowAutoTopicCreation: true,
      });
    }

    await producer.connect();
    isProducerConnected = true;
    logger.info(
      `Kafka Producer connected to broker(s): ${config.KAFKA_BROKER}`,
    );
    return producer;
  } catch (error: any) {
    isProducerConnected = false;
    logger.error(
      new Error(
        `Failed to connect Kafka Producer (${config.KAFKA_BROKER}): ${error.message}`,
      ),
    );
    return null;
  }
};

export const publishEvent = async <T>(
  topic: string,
  event: T,
  key?: string,
): Promise<boolean> => {
  try {
    const prod = await getKafkaProducer();
    if (!prod) {
      logger.warn(
        `Kafka Producer not available. Skipping publish to topic: ${topic}`,
      );
      return false;
    }

    const payload = JSON.stringify(event);
    await prod.send({
      topic,
      messages: [
        {
          key: key || undefined,
          value: payload,
          timestamp: Date.now().toString(),
        },
      ],
    });

    logger.info(
      `[Kafka Producer] Published event to [${topic}] (key: ${key || "none"})`,
    );
    return true;
  } catch (error: any) {
    logger.error(
      new Error(
        `[Kafka Producer] Failed to publish event to [${topic}]: ${error.message}`,
      ),
    );
    return false;
  }
};

export const createKafkaConsumer = (groupId: string): Consumer => {
  return kafka.consumer({
    groupId,
    allowAutoTopicCreation: true,
  });
};

export const disconnectKafka = async (): Promise<void> => {
  if (producer && isProducerConnected) {
    try {
      await producer.disconnect();
      isProducerConnected = false;
      logger.info("Kafka Producer disconnected gracefully");
    } catch (err: any) {
      logger.warn(`Error disconnecting Kafka Producer: ${err.message}`);
    }
  }
};
