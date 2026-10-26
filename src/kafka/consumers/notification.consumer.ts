import { logger } from "../../utils/logger";
import { DriverAssignedEvent, OrderCreatedEvent } from "../topics";

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
  // Di sini bisa memanggil sendEmail / FCM Push Notification / Socket.io secara asinkron
};

export const handleDriverAssignedForNotification = async (
  event: DriverAssignedEvent,
): Promise<void> => {
  logger.info(
    `[Notification Service] 🚗 Driver assigned! Order ${event.orderId} assigned to Driver ${event.driverName || event.driverId}`,
  );
  // Mengirim notifikasi ke user: "Driver sedang menuju ke merchant!"
};
