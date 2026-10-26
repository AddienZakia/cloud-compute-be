import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const OrdersRepo = {
  async findUnique<T extends Prisma.OrderFindUniqueArgs>(args: T) {
    return await prisma.order.findUnique(args);
  },

  async findOne<T extends Prisma.OrderFindFirstArgs>(args: T) {
    return await prisma.order.findFirst(args);
  },

  async findMany<T extends Prisma.OrderFindManyArgs>(args: T) {
    return await prisma.order.findMany(args);
  },

  async count<T extends Prisma.OrderCountArgs>(args?: T) {
    return await prisma.order.count(args);
  },

  async create<T extends Prisma.OrderCreateArgs>(args: T) {
    return await prisma.order.create(args);
  },

  async update<T extends Prisma.OrderUpdateArgs>(args: T) {
    return await prisma.order.update(args);
  },

  async delete<T extends Prisma.OrderDeleteArgs>(args: T) {
    return await prisma.order.delete(args);
  },

  async paginate<
    T extends Prisma.OrderFindManyArgs,
    C extends Prisma.OrderCountArgs,
  >(
    findArgs: Prisma.SelectSubset<T, Prisma.OrderFindManyArgs>,
    countArgs: Prisma.SelectSubset<C, Prisma.OrderCountArgs>,
  ) {
    const [items, total_data] = await prisma.$transaction([
      prisma.order.findMany(findArgs),
      prisma.order.count(countArgs),
    ]);

    return { items, total_data };
  },
};
