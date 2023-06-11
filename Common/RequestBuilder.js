class RequestBuilder {
    constructor() {
        this.payload = [];
    }

    addToPath(payload) {
        this.payload.push({ type: 'path', payload });
    }

    addToBody(payload) {
        this.payload.push({ type: 'body', payload });
    }

    addToQuery(payload) {
        this.payload.push({ type: 'query', payload });
    }

    get get() {
        return this.payload;
    }
}
exports = module.exports = RequestBuilder;
