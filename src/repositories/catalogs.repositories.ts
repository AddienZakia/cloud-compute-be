import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const CatalogsRepo = {
  async findUnique<T extends Prisma.CatalogFindUniqueArgs>(args: T) {
    return await prisma.catalog.findUnique(args);
  },

  async findOne<T extends Prisma.CatalogFindFirstArgs>(args: T) {
    return await prisma.catalog.findFirst(args);
  },

  async findMany<T extends Prisma.CatalogFindManyArgs>(args: T) {
    return await prisma.catalog.findMany(args);
  },

  async count<T extends Prisma.CatalogCountArgs>(args?: T) {
    return await prisma.catalog.count(args);
  },

  async create<T extends Prisma.CatalogCreateArgs>(args: T) {
    return await prisma.catalog.create(args);
  },

  async update<T extends Prisma.CatalogUpdateArgs>(args: T) {
    return await prisma.catalog.update(args);
  },

  async delete<T extends Prisma.CatalogDeleteArgs>(args: T) {
    return await prisma.catalog.delete(args);
  },

  async paginate<
    T extends Prisma.CatalogFindManyArgs,
    C extends Prisma.CatalogCountArgs,
  >(
    findArgs: Prisma.SelectSubset<T, Prisma.CatalogFindManyArgs>,
    countArgs: Prisma.SelectSubset<C, Prisma.CatalogCountArgs>,
  ) {
    const [items, total_data] = await prisma.$transaction([
      prisma.catalog.findMany(findArgs),
      prisma.catalog.count(countArgs),
    ]);

    return { items, total_data };
  },
};
