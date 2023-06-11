class RedisQueryExecution {
    constructor(redis) {
        this.redis = redis;
    }

    async read(redisDBName, storeName, key) {
        this.checkRedisName(redisDBName);
        key = storeName + '_' + key;
        if (!storeName) return false;
        let response = null;
        try {
            response = await this.redis[redisDBName].get(key);
            if (response) response = JSON.parse(response);
            if (response && response.data) return response.data;
        } catch (e) {
            console.error(e.message, response);
        }
        return null;
    }

    checkRedisName(redisDBName) {
        if (!redisDBName) {
            throw new Error(
                `The type name(${
                    redisDBName || ''
                }) is required for Redis Connection. See 'conf/RedisConnections.ts' for config settings.`
            );
        }

        if (!this.redis || !this.redis[redisDBName]) {
            throw new Error(
                `The type name(${
                    redisDBName || ''
                }) is required for Redis Connection. See 'conf/RedisConnections.ts' for config settings.`
            );
        }
    }

    async write(redisDBName, storeName, key, value, expiresAfter) {
        this.checkRedisName(redisDBName);
        key = storeName + '_' + key;
        if (!storeName) return false;
        try {
            let redis = this.redis[redisDBName];
            let expireTime = expiresAfter ? expiresAfter : 86400; // default is 1 day in seconds
            await redis.set(
                key,
                JSON.stringify({ data: value }),
                'ex',
                expireTime
            );
            return true;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async writeIncrement(redisDBName, storeName, key) {
        this.checkRedisName(redisDBName);
        key = storeName + '_ip' + key;
        if (!storeName) return false;
        try {
            let redis = this.redis[redisDBName];
            return await redis.incr(key);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async setExpire(redisDBName, storeName, key, expireTime) {
        this.checkRedisName(redisDBName);
        key = storeName + '_ip' + key;
        if (!storeName) return false;
        try {
            let redis = this.redis[redisDBName];
            return await redis.expire(key, expireTime);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async invalidatePattern(redisDBName, storeName, key) {
        this.checkRedisName(redisDBName);
        key = storeName + '_' + key;
        if (!storeName) return false;
        try {
            let redis = this.redis[redisDBName];
            const keys = await redis.keys(key);
            const pipeline = redis.pipeline();
            keys.forEach(function (key) {
                pipeline.del(key);
            });
            return pipeline.exec();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async invalidate(redisDBName, storeName, key) {
        this.checkRedisName(redisDBName);
        key = storeName + '_' + key;
        if (!storeName) return false;
        try {
            let redis = this.redis[redisDBName];
            await redis.del(key);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async delFromRedis(redisDBName, key) {
        this.checkRedisName(redisDBName);
        if (!key) return false;
        try {
            let redis = this.redis[redisDBName];
            await redis.del(key);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async setInRedis(
        redisDBName,
        key,
        payload,
        expiry,
        timeInSecondOrMs = 'ex',
        exists = null
    ) {
        // value of exists can be
        // NX − Only sets the key if it does not already exist.
        // XX − Only sets the key if it already exists.
        this.checkRedisName(redisDBName);
        if (!key) return false;
        try {
            let redis = this.redis[redisDBName];
            let expireTime = expiry || 86400; // default is 1 day in seconds
            if (exists) {
                return await redis.set(
                    key,
                    JSON.stringify({ data: payload }),
                    timeInSecondOrMs,
                    expireTime,
                    exists
                );
            } else {
                return await redis.set(
                    key,
                    JSON.stringify({ data: payload }),
                    timeInSecondOrMs,
                    expireTime
                );
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getFromRedis(redisDBName, key) {
        this.checkRedisName(redisDBName);
        if (!key) return false;
        try {
            let redis = this.redis[redisDBName];
            let response = await redis.get(key);
            if (response) response = JSON.parse(response);
            if (response && response.data) return response.data;
        } catch (e) {
            console.error(e);
            return null;
        }

        return null;
    }

    async hashSetInRedis(redisDBName, rootKey, childKey, value, expiry) {
        this.checkRedisName(redisDBName);
        if (!rootKey || !childKey) return false;
        try {
            let redis = this.redis[redisDBName];
            let expireTime = expiry || 86400; // default is 1 day in seconds
            await redis.hmset(rootKey, childKey, JSON.stringify(value));
            redis.expire(rootKey, expireTime);
            return;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async hashGetInRedis(redisDBName, rootKey, childKey) {
        this.checkRedisName(redisDBName);
        if (!rootKey || !childKey) return false;
        let response = null;
        try {
            let redis = this.redis[redisDBName];
            response = await redis.hmget(rootKey, childKey);
            if (response && response[0]) return JSON.parse(response[0]);
        } catch (e) {
            console.error(e.message, response);
        }
        return null;
    }

    async hashIvalidate(redisDBName, rootKey, childKey) {
        this.checkRedisName(redisDBName);
        if (!rootKey || !childKey) return false;
        try {
            let redis = this.redis[redisDBName];
            redis.hdel(rootKey, [childKey]);
            return;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}

exports = module.exports = RedisQueryExecution;
