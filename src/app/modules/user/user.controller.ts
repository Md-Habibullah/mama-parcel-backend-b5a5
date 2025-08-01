/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes'
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User created successfully',
        success: true,
        data: user,
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const user = await UserServices.getUserById(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Profile retrieved successfully',
        success: true,
        data: user,
    });
});

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
    const verifiedToken = req.user as JwtPayload
    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User updated successfully',
        success: true,
        data: user,
    })
})

const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;
    const decodedId = (req.user as JwtPayload).userId

    const result = await UserServices.blockUser(userId, decodedId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User blocked successfully',
        success: true,
        data: result,
    })
})

const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;

    const result = await UserServices.unblockUser(userId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User unblocked successfully',
        success: true,
        data: result,
    })
})

export const userControllers = {
    createUser,
    getMyProfile,
    getAllUsers,
    updateUser,
    blockUser,
    unblockUser
}