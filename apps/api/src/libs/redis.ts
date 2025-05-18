import { log } from "@repo/logger";
import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => {
  log("🔌 Redis connection established.");
});

redis.on("ready", () => {
  log("✅ Redis ready.");
});

redis.on("error", (err) => {
  log("❌ Redis error:", err);
});

export default redis;
