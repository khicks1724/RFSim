const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

function requireEnv(name, fallback = "") {
  const value = process.env[name] ?? fallback;
  return value;
}

const config = {
  port: Number(process.env.PORT ?? 3000),
  appOrigin: requireEnv("APP_ORIGIN", "http://localhost:8080"),
  jwtSecret: requireEnv("JWT_SECRET", "dev-only-change-me"),
  databaseUrl: requireEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/ew_sim"),
  nodeEnv: requireEnv("NODE_ENV", "development"),
  databaseSsl: requireEnv("DATABASE_SSL", "false").toLowerCase() === "true"
};

module.exports = { config };