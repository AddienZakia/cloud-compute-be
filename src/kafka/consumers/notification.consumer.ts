import { logger } from "../../utils/logger";
import {
  DriverAssignedEvent,
  OrderCreatedEvent,
  OrderStatusUpdatedEvent,
  PaymentProcessedEvent,
} from "../topics";

/**
 * Notification / Analytics Microservice Worker / Consumer
 * Mendengarkan berbagai event untuk mencatat log, analitik, dan mengirim notifikasi secara asinkron.
 */
export const handleOrderCreatedForNotification = async (
  event: OrderCreatedEvent,
): Promise<void> => {
  logger.info(
    `[Notification Service] 🔔 New Order placed! Order ID: ${event.orderId}, User: ${event.userId}, Items: ${event.items.length}, Total: Rp${event.grossAmount}`,
  );
};

export const handlePaymentProcessedForNotification = async (
  event: PaymentProcessedEvent,
): Promise<void> => {
  logger.info(
    `[Notification Service] 💳 Payment status for Order ${event.orderId}: ${event.status.toUpperCase()} (Rp${event.grossAmount})`,
  );
};

export const handleDriverAssignedForNotification = async (
  event: DriverAssignedEvent,
): Promise<void> => {
  logger.info(
    `[Notification Service] 🚗 Driver assigned! Order ${event.orderId} assigned to Driver ${event.driverName || event.driverId}`,
  );
};

export const handleOrderStatusUpdatedForNotification = async (
  event: OrderStatusUpdatedEvent,
): Promise<void> => {
  logger.info(
    `[Notification Service] 📦 Order Status Updated! Order ${event.orderId} is now [${event.status.toUpperCase()}]`,
  );
};
