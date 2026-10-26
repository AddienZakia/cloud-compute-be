import { DriversRepo } from "../../repositories/drivers.repositories";
import { OrdersRepo } from "../../repositories/orders.repositories";
import { logger } from "../../utils/logger";
import prisma from "../../utils/prisma";
import { publishEvent } from "../kafka.client";
import {
  DriverAssignedEvent,
  KAFKA_TOPICS,
  OrderCreatedEvent,
} from "../topics";

/**
 * Driver Microservice Worker / Consumer
 * Mendengarkan event 'order-created' dan mencari driver yang tersedia secara asinkron.
 */
export const handleOrderCreatedForDriver = async (
  event: OrderCreatedEvent,
): Promise<void> => {
  const { orderId, requestedDriverId } = event;

  try {
    let assignedDriverId: string | null = requestedDriverId || null;
    let driverName: string | undefined;

    if (assignedDriverId) {
      const driver = await DriversRepo.findUnique({
        where: { id: assignedDriverId },
      });
      if (driver) {
        driverName = driver.name;
      }
    } else {
      // Cari driver yang isAvailable = true
      const availableDrivers = await DriversRepo.findMany({
        where: { isAvailable: true },
        take: 10,
      });

      if (availableDrivers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableDrivers.length);
        const selectedDriver = availableDrivers[randomIndex];
        assignedDriverId = selectedDriver.id;
        driverName = selectedDriver.name;
      }
    }

    if (assignedDriverId) {
      await prisma.$transaction(async (tx) => {
        // Assign driver ke order
        await tx.order.update({
          where: { id: orderId },
          data: { driverId: assignedDriverId },
        });

        // Set status driver jadi tidak available
        await tx.driver.update({
          where: { id: assignedDriverId },
          data: { isAvailable: false },
        });
      });

      logger.info(
        `[Driver Service] Successfully assigned Driver (${driverName || assignedDriverId}) to Order ${orderId}`,
      );

      // Publish event bahwa driver berhasil di-assign
      const driverEvent: DriverAssignedEvent = {
        orderId,
        driverId: assignedDriverId,
        driverName,
        assignedAt: new Date().toISOString(),
      };

      await publishEvent(KAFKA_TOPICS.DRIVER_ASSIGNED, driverEvent, orderId);
    } else {
      logger.warn(
        `[Driver Service] No drivers currently available for Order ${orderId}. Order remains in waiting state.`,
      );
    }
  } catch (error: any) {
    logger.error(
      new Error(
        `[Driver Service] Error handling Order ${orderId}: ${error.message}`,
      ),
    );
  }
};
