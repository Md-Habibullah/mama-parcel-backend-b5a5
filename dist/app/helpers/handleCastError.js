"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    // eslint-disable-next-line no-console
    console.log(err);
    return {
        statusCode: 400,
        message: 'Invalid mongodb objectId. please provide a valid id'
    };
};
exports.handleCastError = handleCastError;
