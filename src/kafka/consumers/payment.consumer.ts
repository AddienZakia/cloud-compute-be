import { logger } from "../../utils/logger";
import prisma from "../../utils/prisma";
import { publishEvent } from "../kafka.client";
import {
  KAFKA_TOPICS,
  OrderCreatedEvent,
  PaymentProcessedEvent,
} from "../topics";

/**
 * Payment / Transaction Microservice Worker / Consumer
 * Mendengarkan event 'order-created' dan membuat record transaksi pembayaran secara asinkron.
 */
export const handleOrderCreatedForPayment = async (
  event: OrderCreatedEvent,
): Promise<void> => {
  const { orderId, grossAmount } = event;

  try {
    // Cek apakah transaksi sudah dibuat sebelumnya (idempotency check)
    const existingTransaction = await prisma.transaction.findUnique({
      where: { orderId },
    });

    if (existingTransaction) {
      logger.info(
        `[Payment Service] Transaction already exists for Order ${orderId}. Skipping creation.`,
      );
      return;
    }

    // Buat record Transaction baru
    const transaction = await prisma.transaction.create({
      data: {
        orderId,
        grossAmount,
        status: "pending",
      },
    });

    logger.info(
      `[Payment Service] Created Transaction ${transaction.id} for Order ${orderId} (Amount: Rp${grossAmount})`,
    );

    // Publish event bahwa pembayaran/transaksi telah diinisialisasi
    const paymentEvent: PaymentProcessedEvent = {
      transactionId: transaction.id,
      orderId,
      grossAmount,
      status: "pending",
      paidAt: null,
    };

    await publishEvent(KAFKA_TOPICS.PAYMENT_PROCESSED, paymentEvent, orderId);
  } catch (error: any) {
    logger.error(
      new Error(
        `[Payment Service] Error processing payment for Order ${orderId}: ${error.message}`,
      ),
    );
  }
};
