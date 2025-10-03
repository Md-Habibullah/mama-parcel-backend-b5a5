/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"
import passport from "passport"
import { createUserTokens } from "../../utils/userToken"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(404, 'somthing went wrong'))
        }

        if (!user) {
            return next(new AppError(httpStatus.BAD_REQUEST, info.message))
        }

        const userTokens = await createUserTokens(user)

        const { password: userpass, ...users } = user.toObject()

        setAuthCookie(res, userTokens)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            message: 'User Login Successfully',
            success: true,
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: users
            },
        })
    })(req, res, next)

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No refresh token from cookies ')
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)
    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'New accessToken retrived Successfully',
        success: true,
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: 'none'
    })

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: envVars.NODE_ENV === 'production',
        sameSite: 'none'
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User Logout Successfully',
        success: true,
        data: null,
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, oldPassword } = req.body;
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)


    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Password changed successfully',
        success: true,
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;
    let redirectTo = req.query.state ? req.query.state as string : '';

    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1)
    }

    // eslint-disable-next-line no-console
    console.log('user', user)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found')
    }

    const tokenInfo = await createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}