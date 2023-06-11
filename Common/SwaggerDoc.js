let swaggerDocumentGlobal = null;

class SwaggerDoc {
    static initSwagger(swaggerBase) {
        swaggerDocumentGlobal = swaggerBase;
    }

    static getFinalSwagger() {
        return swaggerDocumentGlobal;
    }

    static recordApi(path, method, ref) {
        const key = path.replace(/:(\w+)/g, '{$&}').replace(/:/g, '');
        const data = {};
        if (!ref.doc) {
            console.error(new Error('Api Doc is required doc function'));
            process.exit();
        }
        const doc = ref.doc();
        data[method] = {
            consumes: ['application/json'],
            produces: ['application/json'],
            security:
                !ref.secured || ref.secured()
                    ? [{ service_token: [] }, { auth_token: [] }]
                    : [{ service_token: [] }],
            parameters: ref.swaggerParametersFromJoi(),
            ...doc,
            ...ref.responses()
        };
        if (!swaggerDocumentGlobal) {
            console.warn('Swagger doc is not initialized');
        }

        swaggerDocumentGlobal.paths[key] = {
            ...swaggerDocumentGlobal.paths[key],
            ...data
        };
    }
    static addTag(name, description) {
        const tag = {
            name,
            description
        };
    }
}

exports = module.exports = SwaggerDoc;
