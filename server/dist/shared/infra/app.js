"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.app = void 0;
require("reflect-metadata");
require("express-async-errors");
require("../container");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const AppError_1 = require("../../errors/AppError");
const swaggerCss_1 = require("../../utils/swaggerCss");
const routes_1 = require("./routes");
const swagger_json_1 = __importDefault(require("./swagger.json"));
exports.app = (0, express_1.default)();
exports.app.use((0, express_1.json)());
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default, {
    customCss: swaggerCss_1.customCss,
    customSiteTitle: 'Flow API',
    swaggerOptions: {
        docExpansion: 'none',
    },
}));
exports.app.use((0, cors_1.default)());
exports.app.use(routes_1.routes);
exports.app.use((err, _request, response, _next) => {
    if (err instanceof AppError_1.AppError) {
        return response.status(err.statusCode).json({
            message: err.message,
        });
    }
    console.log('🚀 ~ file: app.ts ~ line 20 ~ err', err);
    return response.status(500).json({
        status: 'error',
        message: `Internal server error:\n ${err.message}`,
    });
});
exports.httpServer = (0, http_1.createServer)(exports.app);
exports.io = new socket_io_1.Server(exports.httpServer, {
    cors: {
        origin: '*',
    },
});
