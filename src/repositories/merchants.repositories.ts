import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const MerchantsRepo = {
  async findUnique<T extends Prisma.MerchantFindUniqueArgs>(args: T) {
    return await prisma.merchant.findUnique(args);
  },

  async findOne<T extends Prisma.MerchantFindFirstArgs>(args: T) {
    return await prisma.merchant.findFirst(args);
  },

  async findMany<T extends Prisma.MerchantFindManyArgs>(args: T) {
    return await prisma.merchant.findMany(args);
  },

  async count<T extends Prisma.MerchantCountArgs>(args?: T) {
    return await prisma.merchant.count(args);
  },

  async create<T extends Prisma.MerchantCreateArgs>(args: T) {
    return await prisma.merchant.create(args);
  },

  async update<T extends Prisma.MerchantUpdateArgs>(args: T) {
    return await prisma.merchant.update(args);
  },

  async delete<T extends Prisma.MerchantDeleteArgs>(args: T) {
    return await prisma.merchant.delete(args);
  },

  async paginate<
    T extends Prisma.MerchantFindManyArgs,
    C extends Prisma.MerchantCountArgs,
  >(
    findArgs: Prisma.SelectSubset<T, Prisma.MerchantFindManyArgs>,
    countArgs: Prisma.SelectSubset<C, Prisma.MerchantCountArgs>,
  ) {
    const [items, total_data] = await prisma.$transaction([
      prisma.merchant.findMany(findArgs),
      prisma.merchant.count(countArgs),
    ]);

    return { items, total_data };
  },
};
