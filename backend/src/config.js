const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

function getEnv(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function requireEnv(name, fallback = "") {
  const value = process.env[name] ?? fallback;
  if (value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const nodeEnv = getEnv("NODE_ENV", "development");
const isProduction = nodeEnv === "production";

const config = {
  port: Number(process.env.PORT ?? 3000),
  appOrigin: getEnv("APP_ORIGIN", "http://localhost:8080"),
  jwtSecret: isProduction
    ? requireEnv("JWT_SECRET")
    : getEnv("JWT_SECRET", "dev-only-change-me"),
  databaseUrl: isProduction
    ? requireEnv("DATABASE_URL")
    : getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ew_sim"),
  aiConfigSecret: getEnv("AI_CONFIG_SECRET", getEnv("JWT_SECRET", "dev-only-change-me")),
  nodeEnv,
  isProduction,
  databaseSsl: getEnv("DATABASE_SSL", "false").toLowerCase() === "true",
  databaseSslRejectUnauthorized: getEnv(
    "DATABASE_SSL_REJECT_UNAUTHORIZED",
    isProduction ? "true" : "false"
  ).toLowerCase() === "true"
};

module.exports = { config };
