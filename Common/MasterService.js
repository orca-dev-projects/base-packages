const DatabaseController = require('./DatabaseController');
const RedisQueryExecution = require('../bootloader/redis/RedisQueryExecution');
class MasterService {
    constructor() {
        this.dbInstance = DatabaseController.instance();
        this.redis = new RedisQueryExecution(this.dbInstance.redis);
    }

    mongoConnection(name) {
        if (!name) {
            throw new Error(
                `The type name(${
                    name || ''
                }) is required for Mongo Connection. See 'conf/MongoConnections.ts' for config settings.`
            );
        }

        if (
            !this.dbInstance ||
            !this.dbInstance.mongo ||
            !this.dbInstance.mongo[name]
        ) {
            throw new Error(
                `Connection not found with name "${name}". See 'conf/MongoConnections.ts' for config settings.`
            );
        }
        return this.dbInstance.mongo[name];
    }

    async sqlQuery(name, query, data = []) {
        if (!name) {
            throw new Error(
                `The type name(${
                    name || ''
                }) is required for MySQL Connection. See 'conf/MySqlConnections.ts' for config settings.`
            );
        }

        if (
            !this.dbInstance ||
            !this.dbInstance.sql ||
            !this.dbInstance.sql[name]
        ) {
            throw new Error(
                `Connection not found with name "${name}". See 'conf/MySqlConnections.ts' for config settings.`
            );
        }

        try {
            const result = await this.dbInstance.sql[name].query(query, data);
            return {
                status: true,
                result: result,
                err: null
            };
        } catch (err) {
            return {
                status: false,
                result: null,
                err: err
            };
        }
    }

    static instance() {
        if (this.self) return this.self;
        this.self = new this();
        return this.self;
    }
}

exports = module.exports = MasterService;
