export type ApiResponseDTO<T> = {
  code: number;
  status: boolean;
  message: string;
  data?: T;
};
