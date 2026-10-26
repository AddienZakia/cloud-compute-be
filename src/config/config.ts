export const config = {
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",

  // AUTH CONFIG
  COOLDOWN_VERIFY: Number(process.env.COOLDOWN_VERIFY) || 15, // 15 minutes -> Cooldown verify email token
  COOLDOWN_RESET: Number(process.env.COOLDOWN_RESET) || 10, // 10 minutes -> Cooldown reset password token
  COOLDOWN_JWT: Number(process.env.COOLDOWN_JWT) || 15, // 15 minutes -> Cooldown JWT Access Token

  // AZURE BLOB STORAGE CONFIG
  AZURE_STORAGE_CONNECTION_STRING:
    process.env.AZURE_STORAGE_CONNECTION_STRING || "",
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
  AZURE_STORAGE_ACCOUNT_KEY: process.env.AZURE_STORAGE_ACCOUNT_KEY || "",
  AZURE_STORAGE_CONTAINER_NAME:
    process.env.AZURE_STORAGE_CONTAINER_NAME || "cloud-items",

  // KAFKA CONFIG
  KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9092",
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "cloud-be",
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || "cloud-be-group",
  KAFKA_ENABLED: process.env.KAFKA_ENABLED !== "false",
  KAFKA_RUN_EMBEDDED_WORKERS: process.env.KAFKA_RUN_EMBEDDED_WORKERS === "true",
};
