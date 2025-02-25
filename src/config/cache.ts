import { RedisOptions } from 'ioredis';

interface ICacheConfig {
    config: {
        redis: RedisOptions;
    };
    driver: string;
}

export default {
    config: {
        redis: {
            host: process.env.REDIS_HOST,
            PORT: process.env.REDIS_PORT,
            password: process.env.REDIS_PASS || undefined,
        },
    },
    driver: 'redis',
} as ICacheConfig;
