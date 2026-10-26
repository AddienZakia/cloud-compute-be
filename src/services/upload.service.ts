import {
  deleteBlob,
  UploadResult,
  uploadFileToBlob,
} from "../utils/azure-storage";
import { ApiError } from "../utils/error-handler";
import { successResponse } from "../utils/success-response";

export const uploadSingleService = async (
  file?: Express.Multer.File,
  folder?: string,
) => {
  if (!file) {
    throw new ApiError(400, "Please select a file to upload");
  }

  const result: UploadResult = await uploadFileToBlob(file, {
    folder: folder || "uploads",
  });

  return {
    response: successResponse(
      201,
      "File uploaded successfully to Azure Blob",
      result,
    ),
  };
};

export const uploadMultipleService = async (
  files?: Express.Multer.File[],
  folder?: string,
) => {
  if (!files || files.length === 0) {
    throw new ApiError(400, "Please select at least one file to upload");
  }

  const uploadPromises = files.map((file) =>
    uploadFileToBlob(file, {
      folder: folder || "uploads",
    }),
  );

  const results: UploadResult[] = await Promise.all(uploadPromises);

  return {
    response: successResponse(
      201,
      `${results.length} files uploaded successfully to Azure Blob`,
      results,
    ),
  };
};

export const deleteFileService = async (blobNameOrUrl: string) => {
  if (!blobNameOrUrl) {
    throw new ApiError(400, "blobName or url is required");
  }

  const deleted = await deleteBlob(blobNameOrUrl);

  if (!deleted) {
    throw new ApiError(404, "Blob not found or failed to delete");
  }

  return {
    response: successResponse(200, "File deleted successfully", {
      blobNameOrUrl,
      deleted: true,
    }),
  };
};
