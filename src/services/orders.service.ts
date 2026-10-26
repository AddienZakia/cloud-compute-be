import { Request } from "express";
import { z } from "zod";
import { CatalogsRepo } from "../repositories/catalogs.repositories";
import { DriversRepo } from "../repositories/drivers.repositories";
import { MerchantsRepo } from "../repositories/merchants.repositories";
import { OrdersRepo } from "../repositories/orders.repositories";
import { ApiError } from "../utils/error-handler";
import { PaginatedResponse } from "../utils/pagination";
import prisma from "../utils/prisma";
import { successResponse } from "../utils/success-response";
import {
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
} from "../validations/orders.schema";
import {
  paginationQueryDTO,
  paginationSchema,
} from "../validations/pagination.schema";

const orderIncludes = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
  },
  driver: {
    select: {
      id: true,
      name: true,
      email: true,
      isAvailable: true,
    },
  },
  merchant: {
    select: {
      id: true,
      title: true,
      address: true,
      imageUrl: true,
    },
  },
  orderItems: {
    include: {
      catalog: {
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          imageUrl: true,
        },
      },
    },
  },
  transaction: true,
};

export const createOrderService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Authentication required to place an order");
  }

  const validate = createOrderSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const {
    merchantId,
    deliveryAddress,
    driverId: requestedDriverId,
    items,
  } = validate.data;

  // 1. Verify merchant exists and is active
  const merchant = await MerchantsRepo.findUnique({
    where: { id: merchantId },
  });
  if (!merchant) {
    throw new ApiError(404, "Merchant not found");
  }
  if (!merchant.status) {
    throw new ApiError(400, "Merchant is currently not accepting orders");
  }

  // 2. Fetch catalog items and verify they belong to merchant
  const catalogIds = items.map((i) => i.catalogId);
  const catalogs = await CatalogsRepo.findMany({
    where: {
      id: { in: catalogIds },
      merchantId,
      status: true,
    },
  });

  if (catalogs.length !== items.length) {
    throw new ApiError(
      400,
      "One or more catalog items are invalid, inactive, or do not belong to this merchant",
    );
  }

  // 3. Compute price snapshots and gross amount
  const catalogPriceMap = new Map(catalogs.map((c) => [c.id, c.price]));
  let grossAmount = 0;
  const orderItemsData = items.map((item) => {
    const price = catalogPriceMap.get(item.catalogId) || 0;
    grossAmount += price * item.quantity;
    return {
      catalogId: item.catalogId,
      quantity: item.quantity,
      priceSnapshot: price,
    };
  });

  // 4. Assign driver: either requested driver or random available driver
  let assignedDriverId: string | null = requestedDriverId || null;
  if (!assignedDriverId) {
    const availableDrivers = await DriversRepo.findMany({
      where: { isAvailable: true },
      take: 10,
    });
    if (availableDrivers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableDrivers.length);
      assignedDriverId = availableDrivers[randomIndex].id;
    }
  }

  // 5. Create Order, OrderItems, Transaction in a database transaction
  const newOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        merchantId,
        driverId: assignedDriverId,
        deliveryAddress,
        status: "waiting",
        orderItems: {
          create: orderItemsData,
        },
        transaction: {
          create: {
            status: "pending",
            grossAmount,
          },
        },
      },
      include: orderIncludes,
    });

    // If driver assigned, update driver availability
    if (assignedDriverId) {
      await tx.driver.update({
        where: { id: assignedDriverId },
        data: { isAvailable: false },
      });
    }

    return order;
  });

  return successResponse(201, "Successfully created order", newOrder);
};

export const getAllOrdersService = async (
  req: Request,
  paginationQuery: paginationQueryDTO,
) => {
  const validatePagination = paginationSchema.safeParse(paginationQuery);
  if (!validatePagination.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validatePagination.error).fieldErrors,
    );
  }

  const paginationData = validatePagination.data;

  // Filter based on caller's role
  const where: any = {};
  if (req.user?.role === "USER") {
    where.userId = req.user.id;
  } else if (req.user?.role === "DRIVER") {
    where.driverId = req.user.id;
  } else if (req.user?.role === "MERCHANT") {
    where.merchantId = req.user.id;
  }
  // ADMIN can see all orders

  const { items, total_data } = await OrdersRepo.paginate(
    {
      where,
      skip: (paginationData.page - 1) * paginationData.take,
      take: paginationData.take,
      orderBy: { [paginationData.sort_by || "createdAt"]: paginationData.sort },
      include: orderIncludes,
    },
    { where },
  );

  return successResponse(
    200,
    "Success retrieve orders list",
    PaginatedResponse(items, {
      page: paginationData.page,
      take: paginationData.take,
      total_data,
      total_page: Math.ceil(total_data / paginationData.take),
    }),
  );
};

export const getSpecificOrderService = async (
  req: Request,
  orderId: string,
) => {
  const order = await OrdersRepo.findUnique({
    where: { id: orderId },
    include: orderIncludes,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Authorization check
  const role = req.user?.role;
  const userId = req.user?.id;
  if (
    role !== "ADMIN" &&
    order.userId !== userId &&
    order.driverId !== userId &&
    order.merchantId !== userId
  ) {
    throw new ApiError(403, "You're not allowed to view this order");
  }

  return successResponse(200, "Success retrieve order detail", order);
};

export const updateOrderStatusService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const orderId = req.params.id;
  const validate = updateOrderStatusSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const { status, driverId } = validate.data;

  const order = await OrdersRepo.findUnique({
    where: { id: orderId },
  });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(driverId ? { driverId } : {}),
      },
      include: orderIncludes,
    });

    // If order is delivered or cancelled, release driver availability
    if ((status === "delivered" || status === "cancelled") && order.driverId) {
      await tx.driver.update({
        where: { id: order.driverId },
        data: { isAvailable: true },
      });
    }

    return updated;
  });

  return successResponse(
    200,
    "Successfully updated order status",
    updatedOrder,
  );
};

export const editOrderService = async (req: Request) => {
  if (!req.body) {
    throw new ApiError(400, "Request body can't be empty");
  }

  const orderId = req.params.id;
  const validate = updateOrderSchema.safeParse(req.body);
  if (!validate.success) {
    throw new ApiError(
      400,
      "Validations error",
      z.flattenError(validate.error).fieldErrors,
    );
  }

  const exist = await OrdersRepo.findUnique({
    where: { id: orderId },
  });
  if (!exist) {
    throw new ApiError(404, "Order not found");
  }

  const updated = await OrdersRepo.update({
    where: { id: orderId },
    data: validate.data,
    include: orderIncludes,
  });

  return successResponse(200, "Successfully updated order", updated);
};

export const deleteOrderService = async (orderId: string) => {
  const exist = await OrdersRepo.findUnique({ where: { id: orderId } });
  if (!exist) {
    throw new ApiError(404, "Order not found");
  }

  await OrdersRepo.delete({ where: { id: orderId } });
  return successResponse(200, "Successfully deleted order");
};
