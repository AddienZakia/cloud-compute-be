import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/config";
import { ApiError } from "./error-handler";
import { logger } from "./logger";

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  containerName?: string;
}

export interface UploadResult {
  url: string;
  blobName: string;
  containerName: string;
  size: number;
  mimeType: string;
}

let cachedBlobServiceClient: BlobServiceClient | null = null;

/**
 * Mendapatkan client Azure Blob Service berdasarkan Connection String
 * atau Account Name + Account Key yang ada di environment variables.
 */
export const getBlobServiceClient = (): BlobServiceClient => {
  if (cachedBlobServiceClient) {
    return cachedBlobServiceClient;
  }

  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  const accountName = config.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = config.AZURE_STORAGE_ACCOUNT_KEY;

  if (connectionString) {
    cachedBlobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    return cachedBlobServiceClient;
  }

  if (accountName && accountKey) {
    const credential = new StorageSharedKeyCredential(accountName, accountKey);
    cachedBlobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential,
    );
    return cachedBlobServiceClient;
  }

  throw new ApiError(
    500,
    "Azure Storage credentials not configured. Please set AZURE_STORAGE_CONNECTION_STRING or AZURE_STORAGE_ACCOUNT_NAME & AZURE_STORAGE_ACCOUNT_KEY in .env",
  );
};

/**
 * Mendapatkan ContainerClient dan memastikan container sudah ada.
 * Default access level diset ke 'blob' agar image URL bisa langsung diakses secara public oleh browser/client.
 */
export const getContainerClient = async (
  containerName?: string,
): Promise<ContainerClient> => {
  const serviceClient = getBlobServiceClient();
  const targetContainer =
    containerName || config.AZURE_STORAGE_CONTAINER_NAME || "cloud-items";

  const containerClient = serviceClient.getContainerClient(targetContainer);

  // Pastikan container exists dan blob public access diaktifkan jika baru dibuat
  try {
    await containerClient.createIfNotExists({
      access: "blob", // Public read access for blobs only
    });
  } catch (error: any) {
    logger.warn(`Azure container createIfNotExists warning: ${error.message}`);
  }

  return containerClient;
};

/**
 * Generate nama blob unik untuk menghindari collision
 */
const generateBlobName = (
  originalName: string,
  folder?: string,
  customFileName?: string,
): string => {
  const ext = path.extname(originalName) || "";
  const sanitizedOriginal = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_");

  const finalName =
    customFileName || `${Date.now()}-${uuidv4()}-${sanitizedOriginal}${ext}`;

  if (folder) {
    const sanitizedFolder = folder.replace(/^\/+|\/+$/g, "");
    return `${sanitizedFolder}/${finalName}`;
  }

  return finalName;
};

/**
 * Upload Express.Multer.File (support memory storage buffer atau disk storage path) ke Azure Blob Storage
 */
export const uploadFileToBlob = async (
  file: Express.Multer.File,
  options: UploadOptions = {},
): Promise<UploadResult> => {
  if (!file) {
    throw new ApiError(400, "No file provided for upload");
  }

  let fileBuffer: Buffer;

  if (file.buffer) {
    fileBuffer = file.buffer;
  } else if (file.path) {
    fileBuffer = await fs.readFile(file.path);
  } else {
    throw new ApiError(400, "Invalid file format: buffer or path is missing");
  }

  return uploadBufferToBlob(fileBuffer, file.originalname, file.mimetype, {
    folder: options.folder,
    fileName: options.fileName,
    containerName: options.containerName,
  });
};

/**
 * Upload raw Buffer ke Azure Blob Storage
 */
export const uploadBufferToBlob = async (
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  options: UploadOptions = {},
): Promise<UploadResult> => {
  const containerClient = await getContainerClient(options.containerName);
  const blobName = generateBlobName(
    originalName,
    options.folder,
    options.fileName,
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType || "application/octet-stream",
    },
  });

  return {
    url: blockBlobClient.url,
    blobName,
    containerName: containerClient.containerName,
    size: buffer.length,
    mimeType: mimeType || "application/octet-stream",
  };
};

/**
 * Hapus blob dari Azure Storage berdasarkan nama blob atau URL lengkap
 */
export const deleteBlob = async (
  blobNameOrUrl: string,
  containerName?: string,
): Promise<boolean> => {
  try {
    const containerClient = await getContainerClient(containerName);

    // Jika parameter berupa URL lengkap, ekstrak nama blob-nya
    let blobName = blobNameOrUrl;
    if (
      blobNameOrUrl.startsWith("http://") ||
      blobNameOrUrl.startsWith("https://")
    ) {
      const url = new URL(blobNameOrUrl);
      // Format pathname: /<container-name>/<blob-name...>
      const segments = url.pathname.split("/").filter(Boolean);
      if (segments.length > 1) {
        // Ambil setelah container name
        blobName = decodeURIComponent(segments.slice(1).join("/"));
      } else if (segments.length === 1) {
        blobName = decodeURIComponent(segments[0]);
      }
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const deleteResponse = await blockBlobClient.deleteIfExists();
    return deleteResponse.succeeded;
  } catch (error: any) {
    logger.error(new Error(`Failed to delete blob: ${error.message}`));
    return false;
  }
};
