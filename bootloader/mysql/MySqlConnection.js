const mysql = require('mysql2/promise');

/**
 * Responsible to define the MYSQL connections
 * */

class MySqlConnection {
    constructor(type) {
        if (!type.name)
            throw new Error(
                "The type name is required for MySQL Connection. See 'conf/MySqlConnections.ts' for config settings."
            );
        if (!type.envPrefix)
            throw new Error(
                "The type envPrefix is required for MySQL Connection. See 'conf/MySqlConnections.ts' for config settings."
            );
        this.poolName = type.name;
        this.host = process.env[`${type.envPrefix}_DB_HOST`];
        this.port = process.env[`${type.envPrefix}_DB_PORT`];
        this.user = process.env[`${type.envPrefix}_DB_USER`];
        this.password = process.env[`${type.envPrefix}_DB_PASSWORD`];
        this.database = process.env[`${type.envPrefix}_DB_NAME`];
        this.buildOpts();
    }

    buildOpts() {
        this.opts = {
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            multipleStatements: true,
            database: this.database,
            timezone: 'ist',
            charset: 'utf8mb4'
        };
        if (!this.opts.host)
            throw new Error(
                'Invalid Configuration of MySql Connection. Invalid Host.'
            );
        if (!this.opts.port)
            throw new Error(
                'Invalid Configuration of MySql Connection. Invalid Port.'
            );
        if (!this.opts.user)
            throw new Error(
                'Invalid Configuration of MySql Connection. Invalid User.'
            );
        if (!this.opts.password)
            throw new Error(
                'Invalid Configuration of MySql Connection. Invalid Password.'
            );
        if (!this.opts.database)
            throw new Error(
                'Invalid Configuration of MySql Connection. Invalid Database.'
            );
    }

    async getConnection() {
        if (!this._pool)
            this._pool = mysql.createPool({
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password,
                multipleStatements: true,
                database: this.database,
                timezone: 'ist',
                charset: 'utf8mb4'
            });

        try {
            await this._pool.query('Show tables;');
        } catch (c) {
            throw new Error(c); // rethrow because we need to update stack trace for real line numbers.
        }
        return this._pool;
    }
}

exports = module.exports = MySqlConnection;
