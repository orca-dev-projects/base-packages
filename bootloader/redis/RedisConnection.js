const Redis = require('ioredis');

/**
 * Responsible to define the Redis connections
 * */

class RedisConnection {
    constructor(type) {
        if (!type.name)
            throw new Error(
                "The type name is required for Redis Connection. See 'conf/RedisConnections.ts' for config settings."
            );
        if (!type.redisURL)
            throw new Error(
                "The type mongoURL is required for Redis Connection. See 'conf/RedisConnections.ts' for config settings."
            );

        this.redisURL = type.redisURL;
        this.name = type.name;
    }

    async connect() {
        let redis = new Redis(this.redisURL, { connectTimeout: 500 });
        return new Promise((res, rej) => {
            redis.on('error', (err) => {
                console.log(`REDIS CONNECTION ERROR : ${this.name} `, err);
                throw new Error('Can not connect to redis url!');
            });
            redis.on('connect', () => {
                console.log('Connected to Redis! ' + this.redisURL);
                res(redis);
            });
        });
    }
}

exports = module.exports = RedisConnection;
