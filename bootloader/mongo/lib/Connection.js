/**
 * Manages the connection
 * */

const MongoClient = require('mongodb').MongoClient;
const { retryWithBreaker } = require('../../../Common/CircuitBreakerWithRetry');
class Connection {
    constructor(type, callback) {
        if (!type.name)
            throw new Error(
                "The type name is required for Mongo Connection. See 'conf/MongoConnections.ts' for config settings."
            );
        if (!type.mongoURL)
            throw new Error(
                "The type mongoURL is required for Mongo Connection. See 'conf/MongoConnections.ts' for config settings."
            );

        this.mongoUrl = type.mongoURL;
        this.name = type.name;
        this.connect(callback);
    }

    connect(callback, contex) {
        let that = this;
        if (!this.mongoUrl)
            throw new Error(
                '[Missing Url]Can not connect without a mongo url!'
            );

        retryWithBreaker.execute(() =>
            MongoClient.connect(this.mongoUrl, async (err, client) => {
                if (err) {
                    console.log('MONGO CONNECTION ERROR ', err, contex.attempt);
                    throw new Error('Can not connect to mongo url!');
                }
                let db = client.db(this.name);
                callback(db);
            })
        );
    }
}

exports = module.exports = Connection;
