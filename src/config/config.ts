export const config = {
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",

  // AUTH CONFIG
  COOLDOWN_VERIFY: Number(process.env.COOLDOWN_VERIFY) || 15, // 15 minutes -> Cooldown verify email token
  COOLDOWN_RESET: Number(process.env.COOLDOWN_RESET) || 10,   // 10 minutes -> Cooldown reset password token
  COOLDOWN_JWT: Number(process.env.COOLDOWN_JWT) || 15,       // 15 minutes -> Cooldown JWT Access Token
};
