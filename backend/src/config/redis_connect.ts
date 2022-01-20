import { Client, Schema, Entity } from "redis-om"

export const redisClient = new Client()

export const redisConnect = async () => {
    if(!redisClient.isOpen()) {
        await redisClient.open(process.env.REDIS_URI)
        try {
            await redisClient.execute(["PING"])
            console.log("Redis server running...")
        } catch (error) {
            console.log("Unable to connect to redis sever!!")
        }
    }    
}