class ResponseBuilder {
    constructor(statusCode, data, message) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.obj = { statusCode, data, message };
    }

    toObject() {
        return this.obj;
    }
}

exports = module.exports = ResponseBuilder;
