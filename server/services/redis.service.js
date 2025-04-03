import Redis from "ioredis";


// redis connect ke liye or ye sari info database ke public endpoint mei hai 
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD    
})

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.log("Redis client error", err);
});

export default redisClient;