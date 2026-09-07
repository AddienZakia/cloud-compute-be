import { ApiResponseDTO } from "../dto/response/api-response.dto";

export const successResponse = <T>(
  code: number,
  message: string,
  data?: T,
): ApiResponseDTO<T> => {
  return {
    code,
    status: true,
    message: message || "Success",
    data,
  };
};
