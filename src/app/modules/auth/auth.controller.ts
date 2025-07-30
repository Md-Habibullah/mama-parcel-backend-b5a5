/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { UserServices } from "../user/user.service"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.service"
import AppError from "../../errorHelpers/AppError"
import { setAuthCookie } from "../../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserToken } from "../../utils/userToken"
import { envVars } from "../../config/env"
import passport from "passport"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(404, 'somthing went wrong'))
        }

        if (!user) {
            // return new AppError(404, 'User does not exist')
            return next(new AppError(404, info.message))
        }

        const userTokens = await createUserToken(user)

        // delete user.toObject().password
        const { password: userpass, ...users } = user.toObject()

        setAuthCookie(res, user)

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
    // const loginInfo = await AuthServices.credentialsLogin(req.body)
    // res.cookie('accessToken', loginInfo.accessToken, { httpOnly: true, secure: false })
    // res.cookie('refreshToken', loginInfo.refreshToken, { httpOnly: true, secure: false })

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No refresh token from cookies ')
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)
    // res.cookie('accessToken', tokenInfo.accessToken, { httpOnly: true, secure: false })
    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'New accessToken retrived Successfully',
        success: true,
        data: tokenInfo,
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'lax' })
    res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax' })

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
    // console.log(user)
    let redirectTo = req.query.state ? req.query.state as string : '';

    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1)
    }

    // eslint-disable-next-line no-console
    console.log('user', user)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found')
    }

    const tokenInfo = await createUserToken(user)
    // console.log(tokenInfo)

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