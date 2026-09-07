import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const UsersRepo = {
  async findOne<T extends Prisma.UsersFindFirstArgs>(args: T) {
    return await prisma.users.findFirst(args);
  },

  async findMany<T extends Prisma.UsersFindManyArgs>(args: T) {
    return await prisma.users.findMany(args);
  },

  async count<T extends Prisma.UsersCountArgs>(args?: T) {
    return await prisma.users.count(args);
  },

  async create<T extends Prisma.UsersCreateArgs>(args: T) {
    return await prisma.users.create(args);
  },

  async update<T extends Prisma.UsersUpdateArgs>(args: T) {
    return await prisma.users.update(args);
  },

  async delete<T extends Prisma.UsersDeleteArgs>(args: T) {
    return await prisma.users.delete(args);
  },

  async paginate<
    T extends Prisma.UsersFindManyArgs,
    C extends Prisma.UsersCountArgs,
  >(
    findArgs: Prisma.SelectSubset<T, Prisma.UsersFindManyArgs>,
    countArgs: Prisma.SelectSubset<C, Prisma.UsersCountArgs>,
  ) {
    const [items, total_data] = await prisma.$transaction([
      prisma.users.findMany(findArgs),
      prisma.users.count(countArgs),
    ]);

    return { items, total_data };
  },
};
