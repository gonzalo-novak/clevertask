import { createClient } from "redis";
import { logger } from "../app";

export const createRedisClient = async () =>
	await createClient({
		url: process.env.REDIS_URL,
	})
		.on("error", (err) => logger.error("Redis Client Error", err))
		.connect();
