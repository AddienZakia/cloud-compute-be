import { z } from "zod";

export const createOrderItemSchema = z.object({
  catalogId: z.string().min(1, "Catalog ID is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID is required"),
  deliveryAddress: z
    .string()
    .min(5, "Delivery address must be min 5 characters"),
  driverId: z.string().optional(),
  items: z
    .array(createOrderItemSchema)
    .min(1, "Order must have at least 1 item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["waiting", "picked", "delivered", "cancelled"], {
    error: "Status must be waiting, picked, delivered, or cancelled",
  }),
  driverId: z.string().optional(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["waiting", "picked", "delivered", "cancelled"]).optional(),
  driverId: z.string().optional().nullable(),
  deliveryAddress: z.string().min(5).optional(),
});

export type createOrderType = z.infer<typeof createOrderSchema>;
export type updateOrderStatusType = z.infer<typeof updateOrderStatusSchema>;
export type updateOrderType = z.infer<typeof updateOrderSchema>;
