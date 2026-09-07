import { ApiResponseDTO } from "../api-response.dto";

export type loginResponseDTO = ApiResponseDTO<{
  token: string;
  role: string;
}>;
