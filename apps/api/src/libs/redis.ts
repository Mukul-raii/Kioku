import { log } from "@repo/logger";
import IORedis from "ioredis";

 const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
//clean redis cache 
if (process.env.REDIS_URL) {
  redis.flushall().then(() => {
    log("✅ Redis cache cleared.");
  }).catch((err) => {
    log("❌ Failed to clear Redis cache:", err);
  });
}

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