/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";
import { TErrorSources } from "../interfaces/error.types";
import { handleValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { handleCastError } from "../helpers/handleCastError";
import { handleDuplicateError } from "../helpers/hendleDuplicateError";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(err)
    }

    let statusCode = 500;
    let message = "Sothing went wrong"
    let errorSources: TErrorSources[] = [
        //     {
        //     path: 'path',
        //     message: 'message'
        // }
    ]

    // mongoose duplicate error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // mongoose cast error for mongodb id
    else if (err.name === 'CastError') {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // mongoose validation error
    else if (err.name === 'ValidatorError') {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[];
        message = simplifiedError.message
    }
    // zod error
    else if (err.name === 'ZodError') {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
        // err.issues.forEach((issue: any) => errorSources.push(
        //     {
        //         path: issue.path[issue.path.length - 1],
        //         message: issue.message
        //     }
        // ))
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === 'development' ? err.stack : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}