import {
  MetadataType,
  PaginationResponseDTO,
} from "../dto/response/pagination.response.dto";
import { paginationQueryDTO } from "../validations/pagination.schema";

export const PaginatedResponse = <T>(
  data: T,
  metadata: MetadataType,
): PaginationResponseDTO<T> => {
  return {
    data,
    metadata,
  };
};

export const buildPrismaWhere = (q: paginationQueryDTO) => {
  if (!q.filter) return;
  const filter = q.filter.split(",");
  const filterValue = q.filter_by?.split(",");

  // return filterBy;
  const prismaFilter = filter.map((x, i) => {
    return {
      [x]: { contains: filterValue![i], mode: "insensitive" },
    };
  });

  return prismaFilter[0];
};
