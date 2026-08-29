import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(
    process.env.PORT || 5001
  ),

  mongoUri:
    process.env.MONGODB_URI || "",

  jwtSecret:
    process.env.JWT_SECRET ||
    "dev-only-change-me",

  clientUrl:
    process.env.CLIENT_URL ||
    "http://localhost:5173",

  /*
  |--------------------------------------------------------------------------
  | Judge0
  |--------------------------------------------------------------------------
  */

  judge0Url:
    process.env.JUDGE0_URL || "",

  judge0ApiKey:
    process.env.JUDGE0_API_KEY || "",

  judge0ApiHost:
    process.env.JUDGE0_API_HOST || ""
};