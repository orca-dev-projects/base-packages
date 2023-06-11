const SwaggerDoc = require("./SwaggerDoc");
const {
  SUCCESS_200,
  SUCCESS_201,
  ERROR_400,
  ERROR_401,
  ERROR_403,
  ERROR_500,
} = require("../custom/errorMessages");

const Joi = require("@hapi/joi");
const ResponseBuilder = require("./ResponseBuilder");
const extend = require("extend");
// const jwt = require('jsonwebtoken');
const j2s = require("joi-to-swagger");
const ejs = require("./JsonToSwagger");

/**
 * Defines the master class for API Endpoint definition. Encapsulates all common functionality
 * */
class MasterController {
  constructor(queryParams, body, headers, req, res, validate) {
    // Define data
    this.query = queryParams;
    this.params = req.params;
    this.body = body;
    this.data = extend(false, {}, req.params, queryParams, body, {
      user: req.user,
    });
    this.headers = headers;
    this.req = req;
    this.res = res;
    this.env = process.env;

    // add helper classes
    this.ResponseBuilder = ResponseBuilder;
    this.Joi = Joi;

    // get validations and security config
    // TODO will be adding auth validation here
    // this.securedEndpoint = !!this.isSecured;
    // this.securedEndpointForFaculty = !!this.isSecuredForFaculty;
    // this.securedEndpointForTutor = !!this.isSecuredForTutor;
    this.validationRules = validate;

    this.errors = [];
  }

  async doValidate() {
    if (this.validationRules) {
      // run validations
      this.validationRules.payload.forEach((val) => {
        let toValidate = {};
        switch (val.type) {
          case "path":
            toValidate = this.params;
            break;
          case "query":
            toValidate = this.query;
            break;
          case "body":
            toValidate = this.body;
            break;
        }
        const { error } = val.payload.validate(this.data, {
          abortEarly: false,
          allowUnknown: true,
        });
        if (error) {
          this.errors.push(...error.details.map((o) => o.message));
        }
      });

      return !this.errors.length;
    } else {
      return true;
    }
  }

  async run() {
    // TODO will be adding auth validation here

    // payload validate
    if (!(await this.doValidate())) {
      // validation failure
      return new this.ResponseBuilder(400, {}, this.errors.join(", ")).toObject(
        { lang: this.req.headers["accept-language"] || "en" }
      );
    }

    // run handler
    try {
      const response = await this.controller();
      if (response instanceof this.ResponseBuilder) {
        return response.toObject({
          lang: this.req.headers["accept-language"] || "en",
        });
      } else
        throw new Error(
          "Response builder response is required from API controller."
        );
    } catch (error) {
      console.log(error);

      if (error.name === "ValidationError") {
        return new this.ResponseBuilder(400, {}, error.message);
      }

      return new this.ResponseBuilder(
        500,
        {},
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : error.message
      ).toObject({ lang: this.req.headers["accept-language"] || "en" });
    }
  }

  static responses() {
    return {
      responses: {
        200: {
          schema: {
            type: "object",
            properties: {
              statusCode: {
                type: "number",
                example: 200,
              },
              data: !!this.response200
                ? ejs(this.response200().data)
                : { type: "object" },
              message: {
                type: "string",
                example: !!this.response200
                  ? this.response200().msg
                  : SUCCESS_200,
              },
            },
          },
        },
        201: {
          schema: {
            type: "object",
            properties: {
              statusCode: {
                type: "number",
                example: 201,
              },
              data: !!this.response201
                ? ejs(this.response201().data)
                : { type: "object" },
              message: {
                type: "string",
                example: !!this.response201
                  ? this.response201().msg
                  : SUCCESS_201,
              },
            },
          },
        },
        400: {
          schema: {
            type: "object",
            properties: {
              statusCode: {
                type: "number",
                example: 400,
              },
              data: !!this.response400
                ? ejs(this.response400().data)
                : { type: "object" },
              message: {
                type: "string",
                example: !!this.response400
                  ? this.response400().msg
                  : ERROR_400,
              },
            },
          },
        },
        401: {
          schema: {
            type: "object",
            properties: {
              statusCode: {
                type: "number",
                example: 401,
              },
              data: !!this.response401
                ? ejs(this.response401().data)
                : { type: "object" },
              message: {
                type: "string",
                example: !!this.response401
                  ? this.response401().msg
                  : ERROR_401,
              },
            },
          },
        },
        403: {
          schema: {
            type: "object",
            properties: {
              statusCode: {
                type: "number",
                example: 403,
              },
              data: !!this.response403
                ? ejs(this.response403().data)
                : { type: "object" },
              message: {
                type: "string",
                example: !!this.response403
                  ? this.response403().msg
                  : ERROR_403,
              },
            },
          },
        },
        500: {
          schema: {
            type: "object",
            properties: {
              statusCode: {
                type: "number",
                example: 500,
              },
              data: !!this.response500
                ? ejs(this.response500().data)
                : { type: "object" },
              message: {
                type: "string",
                example: !!this.response500
                  ? this.response500().msg
                  : ERROR_500,
              },
            },
          },
        },
      },
    };
  }

  // static response200() {
  //     return {
  //         type: 'object',
  //         properties: {
  //             statusCode: {
  //                 type: "number",
  //                 example: 200
  //             },
  //             data: !!this.apiSuccessResponse ? this.apiSuccessResponse() : { type: "object" },
  //             message: {
  //                 type: "string",
  //                 example: "success"
  //             },
  //         }
  //     }
  // }

  // static response201() {
  //     return {
  //         type: 'object',
  //         properties: {
  //             statusCode: {
  //                 type: "number",
  //                 example: 201
  //             },
  //             data: !!this.apiSuccessResponse ? this.createApiSuccessResponse() : { type: "object" },
  //             message: {
  //                 type: "string",
  //                 example: "success"
  //             },
  //         }
  //     }
  // }

  static swaggerParametersFromJoi() {
    if (!this.validate && !this.bodyPayload) {
      return [];
    }
    let properties = [];
    for (let { type, payload } of this.validate().payload) {
      const { swagger } = j2s(payload);
      if (type !== "body") {
        for (let key of Object.keys(swagger.properties)) {
          let finalObj = {
            name: key,
            in: type,
            required: (swagger.required || []).indexOf(key) > -1,
            ...swagger.properties[key],
          };
          properties.push(finalObj);
        }
      } else {
        let finalObj = {
          name: "body",
          in: "body",
          required: true,
          schema: {
            type: "object",
            properties: {},
          },
        };
        for (let key of Object.keys(swagger.properties)) {
          finalObj.schema.properties[key] = {
            required: (swagger.required || []).indexOf(key) > -1,
            ...swagger.properties[key],
          };
          properties.push(finalObj);
        }
      }
    }
    return properties;
  }

  static get handler() {
    const self = this;
    const validate = this.validate ? this.validate() : null;
    return async (event, ctx) => {
      let body = event.body;
      try {
        body = JSON.parse(body);
      } catch (c) {
        // already parsed body, or no body.
        body = body || {};
      }
      const agent = new self(
        event.queryStringParameters,
        body,
        event.headers || {},
        event.req,
        event.res,
        validate
      );
      let { statusCode, data, message } = await agent.run();
      let status = null;
      // regex to test that status code start with 2 and should me 3 digits in length
      const pattern = /^2\d{2}$/;
      pattern.test(statusCode) ? (status = "success") : (status = "failure");

      return {
        statusCode: statusCode || 200,
        body: { status, data, message },
      };
    };
  }

  static get runAsExpress() {
    const self = this;
    return (req, res) => {
      const event = {
        body: req.body,
        headers: req.headers,
        queryStringParameters: req.query,
        req,
        res,
      };
      self.handler(event, {}).then((resp) => {
        res
          .status(resp.statusCode)
          .header("Cache-Control", "no-cache")
          .json(resp.body);
      });
    };
  }

  static get(router, path, middlewares = []) {
    SwaggerDoc.recordApi(path, "get", this);
    return router.get(path, middlewares, this.runAsExpress);
  }

  static post(router, path, middlewares = []) {
    SwaggerDoc.recordApi(path, "post", this);
    return router.post(path, middlewares, this.runAsExpress);
  }

  static patch(router, path, middlewares = []) {
    SwaggerDoc.recordApi(path, "patch", this);
    return router.patch(path, middlewares, this.runAsExpress);
  }

  static delete(router, path, middlewares = []) {
    SwaggerDoc.recordApi(path, "delete", this);
    return router.delete(path, middlewares, this.runAsExpress);
  }

  static put(router, path, middlewares = []) {
    SwaggerDoc.recordApi(path, "put", this);
    return router.put(path, middlewares, this.runAsExpress);
  }
}

exports = module.exports = MasterController;
