import AppError from "../../errorHelpers/AppError"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Email does not exist')
    }

    if (isUserExist.isActive === 'BLOCKED' || isUserExist.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked or deleted');
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatch) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect Password')
    }

    const userToken = createUserToken(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userpass, ...users } = isUserExist.toObject()

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: users
    }
}

const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User does not matched')
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Old password does not match')
    }

    user.password = await bcryptjs.hashSync(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user.save()

    return;
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}