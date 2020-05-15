import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

const limiterRedis = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimiter',
    points: 5,
    duration: 1,
});

export default async function rateLimiter(
    request: Request,
    response: Response,
    nextFunction: NextFunction,
): Promise<void> {
    try {
        await limiterRedis.consume(request.ip);

        return nextFunction();
    } catch (err) {
        throw new AppError('Chill out, asshole', 429);
    }
}
