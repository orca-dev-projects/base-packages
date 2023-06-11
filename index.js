const DatabaseController = require('./Common/DatabaseController');
const MasterController = require('./Common/MasterController');
const MasterService = require('./Common/MasterService');
const RequestBuilder = require('./Common/RequestBuilder');
const ResponseBuilder = require('./Common/ResponseBuilder');
const SwaggerDoc = require('./Common/SwaggerDoc');
const CircuitBreakerWithRetry = require('./Common/CircuitBreakerWithRetry');
const Joi = require('@hapi/joi');

const initSQL = async (sqlTypes) => {
    const dbInstance = DatabaseController.instance();
    await dbInstance.initSQL(sqlTypes);
};

const initMongo = async (mongoTypes) => {
    const dbInstance = DatabaseController.instance();
    await dbInstance.initMongo(mongoTypes);
};

const initRedis = async (redisTypes) => {
    const dbInstance = DatabaseController.instance();
    await dbInstance.initRedis(redisTypes);
};

const initSwagger = SwaggerDoc.initSwagger;
const getFinalSwagger = SwaggerDoc.getFinalSwagger;
exports = module.exports = {
    MasterController,
    MasterService,
    initSQL,
    initMongo,
    initRedis,
    RequestBuilder,
    Joi,
    initSwagger,
    getFinalSwagger,
    ResponseBuilder,
    CircuitBreakerWithRetry
};
