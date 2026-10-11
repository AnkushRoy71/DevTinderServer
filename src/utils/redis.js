const Redis = require("ioredis");

const redisOptions = {
  host: process.env.REDIS_HOST || "redis-16038.crce217.ap-south-1-1.ec2.cloud.redislabs.com",
  port: Number(process.env.REDIS_PORT || 16038),
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD,
  lazyConnect: true,
};

if (!redisOptions.password) {
  throw new Error("REDIS_PASSWORD must be set to connect to Redis Cloud");
}

if (process.env.REDIS_TLS === "true") {
  redisOptions.tls = {};
}

const pubClient = new Redis(redisOptions);
const subClient = pubClient.duplicate();

pubClient.on("error", (error) => {
  console.error("Redis publisher error:", error);
});

subClient.on("error", (error) => {
  console.error("Redis subscriber error:", error);
});

module.exports = { pubClient, subClient };

