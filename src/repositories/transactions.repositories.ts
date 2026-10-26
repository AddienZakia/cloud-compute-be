import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const TransactionsRepo = {
  async findUnique<T extends Prisma.TransactionFindUniqueArgs>(args: T) {
    return await prisma.transaction.findUnique(args);
  },

  async findOne<T extends Prisma.TransactionFindFirstArgs>(args: T) {
    return await prisma.transaction.findFirst(args);
  },

  async findMany<T extends Prisma.TransactionFindManyArgs>(args: T) {
    return await prisma.transaction.findMany(args);
  },

  async count<T extends Prisma.TransactionCountArgs>(args?: T) {
    return await prisma.transaction.count(args);
  },

  async create<T extends Prisma.TransactionCreateArgs>(args: T) {
    return await prisma.transaction.create(args);
  },

  async update<T extends Prisma.TransactionUpdateArgs>(args: T) {
    return await prisma.transaction.update(args);
  },

  async delete<T extends Prisma.TransactionDeleteArgs>(args: T) {
    return await prisma.transaction.delete(args);
  },

  async paginate<
    T extends Prisma.TransactionFindManyArgs,
    C extends Prisma.TransactionCountArgs,
  >(
    findArgs: Prisma.SelectSubset<T, Prisma.TransactionFindManyArgs>,
    countArgs: Prisma.SelectSubset<C, Prisma.TransactionCountArgs>,
  ) {
    const [items, total_data] = await prisma.$transaction([
      prisma.transaction.findMany(findArgs),
      prisma.transaction.count(countArgs),
    ]);

    return { items, total_data };
  },
};
