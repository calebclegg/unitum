import { Client, Schema, Entity } from "redis-om";

export const redisClient = new Client();

export const redisConnect = async () => {
  if (!redisClient.isOpen()) {
    try {
      await redisClient.open(process.env.REDIS_URI);
      console.log("Redis server running...");
    } catch (error) {
      console.log("Unable to connect to redis sever!!\n Reconnecting...");
      await redisConnect();
    }
  }
};
