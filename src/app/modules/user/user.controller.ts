/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// import AppError from "../../errorHelpers/AppError";


// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new AppError(400, 'error from AppError')
//         // throw new Error('error from Error')
//         const user = await UserServices.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message: 'User created successfully',
//             user
//         })

//     } catch (err: any) {
//         // eslint-disable-next-line no-console
//         console.log(err.name)
//         next(err)
//         // res.status(400).json({ m: err.message, err })
//     }
// }

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    // res.status(httpStatus.CREATED).json({
    //     message: 'User created successfully',
    //     user
    // })
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User created successfully',
        success: true,
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: 'users retreive successfully',
    //     users
    // })
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'All users retreive successfully',
        success: true,
        data: result.data,
        meta: result.meta
    })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = (verifyToken(token as string, envVars.JWT_ACCESS_SECRET)) as JwtPayload
    const verifiedToken = req.user as JwtPayload
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    // res.status(httpStatus.CREATED).json({
    //     message: 'User created successfully',
    //     user
    // })
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User updated successfully',
        success: true,
        data: user,
    })
})

export const userControllers = {
    createUser,
    getAllUsers,
    updateUser
}