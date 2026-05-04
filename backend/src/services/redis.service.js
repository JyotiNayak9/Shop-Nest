// src/services/redis.service.js
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL); // from Upstash

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));

const redisSvc = {
    // Save OTP with expiry in seconds
    setOtp: async (email, otp, expirySeconds = 300) => {
        await redis.set(`otp:${email}`, otp, 'EX', expirySeconds);
        // key = "otp:nayakjyoti789@gmail.com"
        // value = "482910"
        // auto-deletes after 300s (5 min)
    },

    // Get OTP
    getOtp: async (email) => {
        return await redis.get(`otp:${email}`);
    },

    // Delete OTP after successful verification
    deleteOtp: async (email) => {
        await redis.del(`otp:${email}`);
    }
};

module.exports = redisSvc;