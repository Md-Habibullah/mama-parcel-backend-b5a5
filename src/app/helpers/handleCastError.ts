import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/error.types"

export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    // eslint-disable-next-line no-console
    console.log(err)
    return {
        statusCode: 400,
        message: 'Invalid mongodb objectId. please provide a valid id'
    }
}