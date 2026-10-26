export const KAFKA_TOPICS = {
  ORDER_CREATED: "order-created",
  PAYMENT_PROCESSED: "payment-processed",
  DRIVER_ASSIGNED: "driver-assigned",
  ORDER_STATUS_UPDATED: "order-status-updated",
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];

export interface OrderItemPayload {
  catalogId: string;
  quantity: number;
  priceSnapshot: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  merchantId: string;
  deliveryAddress: string;
  requestedDriverId?: string | null;
  grossAmount: number;
  items: OrderItemPayload[];
  createdAt: string;
}

export interface PaymentProcessedEvent {
  transactionId: string;
  orderId: string;
  grossAmount: number;
  status: "pending" | "success" | "failed";
  paidAt?: string | null;
}

export interface DriverAssignedEvent {
  orderId: string;
  driverId: string;
  driverName?: string;
  assignedAt: string;
}

export interface OrderStatusUpdatedEvent {
  orderId: string;
  status: string;
  driverId?: string | null;
  updatedAt: string;
}
