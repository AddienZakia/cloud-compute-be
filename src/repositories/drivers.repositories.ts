import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const DriversRepo = {
  async findUnique<T extends Prisma.DriverFindUniqueArgs>(args: T) {
    return await prisma.driver.findUnique(args);
  },

  async findOne<T extends Prisma.DriverFindFirstArgs>(args: T) {
    return await prisma.driver.findFirst(args);
  },

  async findMany<T extends Prisma.DriverFindManyArgs>(args: T) {
    return await prisma.driver.findMany(args);
  },

  async count<T extends Prisma.DriverCountArgs>(args?: T) {
    return await prisma.driver.count(args);
  },

  async create<T extends Prisma.DriverCreateArgs>(args: T) {
    return await prisma.driver.create(args);
  },

  async update<T extends Prisma.DriverUpdateArgs>(args: T) {
    return await prisma.driver.update(args);
  },

  async delete<T extends Prisma.DriverDeleteArgs>(args: T) {
    return await prisma.driver.delete(args);
  },

  async paginate<
    T extends Prisma.DriverFindManyArgs,
    C extends Prisma.DriverCountArgs,
  >(
    findArgs: Prisma.SelectSubset<T, Prisma.DriverFindManyArgs>,
    countArgs: Prisma.SelectSubset<C, Prisma.DriverCountArgs>,
  ) {
    const [items, total_data] = await prisma.$transaction([
      prisma.driver.findMany(findArgs),
      prisma.driver.count(countArgs),
    ]);

    return { items, total_data };
  },
};
