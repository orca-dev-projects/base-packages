const MySqlConnection = require('../bootloader/mysql');
const MongoConnection = require('../bootloader/mongo');
const RedisConnection = require('../bootloader/redis');
const { retryWithBreaker } = require('./CircuitBreakerWithRetry');

class DatabaseController {
    constructor() {
        this.sql = {};
        this.mongo = {};
        this.redis = {};
    }

    async initMongo(mongoTypes) {
        for (let idx = 0; idx < mongoTypes.length; idx++) {
            let type = mongoTypes[idx];
            await new Promise((res) => {
                new MongoConnection(type, (db) => {
                    this.mongo[mongoTypes.name] = db;
                    res();
                });
            });
        }
    }

    async initSQL(sqlTypes) {
        for (let idx = 0; idx < sqlTypes.length; idx++) {
            let type = sqlTypes[idx];
            this.sql[type.name] = await retryWithBreaker.execute(() =>
                new MySqlConnection(type).getConnection()
            );
        }
    }

    async initRedis(redisTypes) {
        for (let idx = 0; idx < redisTypes.length; idx++) {
            let type = redisTypes[idx];
            this.redis[type.name] = await retryWithBreaker.execute(() =>
                new RedisConnection(type).connect()
            );
        }
    }

    static instance() {
        if (this.self) return this.self;
        this.self = new this();
        return this.self;
    }
}

exports = module.exports = DatabaseController;
