import { Client } from "redis-om";

export const redisClient = new Client();

export const redisConnect = async () => {
  let limit = 5;
  if (!redisClient.isOpen()) {
    try {
      await redisClient.open(process.env.REDIS_URI);
      console.log("Redis server running...");
    } catch (error) {
      while (limit > 0) {
        limit--;
        console.log("Unable to connect to redis sever!!\n Reconnecting...");
        await redisConnect();
        console.log(limit);
      }
      console.log("Couldn't connect to redis");
      process.exit(1);
    }
  }
};
