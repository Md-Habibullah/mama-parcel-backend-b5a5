"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const handleValidationError_1 = require("../helpers/handleValidationError");
const handleZodError_1 = require("../helpers/handleZodError");
const handleCastError_1 = require("../helpers/handleCastError");
const hendleDuplicateError_1 = require("../helpers/hendleDuplicateError");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(err);
    }
    let statusCode = 500;
    let message = "Sothing went wrong";
    let errorSources = [
    //     {
    //     path: 'path',
    //     message: 'message'
    // }
    ];
    // mongoose duplicate error
    if (err.code === 11000) {
        const simplifiedError = (0, hendleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // mongoose cast error for mongodb id
    else if (err.name === 'CastError') {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // mongoose validation error
    else if (err.name === 'ValidatorError') {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    // zod error
    else if (err.name === 'ZodError') {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        // err.issues.forEach((issue: any) => errorSources.push(
        //     {
        //         path: issue.path[issue.path.length - 1],
        //         message: issue.message
        //     }
        // ))
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env_1.envVars.NODE_ENV === 'development' ? err.stack : null,
        stack: env_1.envVars.NODE_ENV === 'development' ? err.stack : null
    });
};
exports.globalErrorHandler = globalErrorHandler;
