export type MetadataType = {
  page: number;
  take: number;
  total_data: number;
  total_page: number;
};

export type PaginationResponseDTO<T> = {
  data: T;
  metadata: MetadataType;
};
