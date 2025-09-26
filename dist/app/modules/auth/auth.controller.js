"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setCookie_1 = require("../../utils/setCookie");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const userToken_1 = require("../../utils/userToken");
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.default(404, 'somthing went wrong'));
        }
        if (!user) {
            // return new AppError(404, 'User does not exist')
            return next(new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, info.message));
        }
        // const userTokens = await createUserTokens(user)
        // // delete user.toObject().password
        // const { password: pass, ...users } = user.toObject()
        // setAuthCookie(res, userTokens)
        const userTokens = yield (0, userToken_1.createUserTokens)(user);
        // delete user.toObject().password
        const _a = user.toObject(), { password: userpass } = _a, users = __rest(_a, ["password"]);
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            message: 'User Login Successfully',
            success: true,
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: users
            },
        });
    }))(req, res, next);
    // const loginInfo = await AuthServices.credentialsLogin(req.body)
    // res.cookie('accessToken', loginInfo.accessToken, { httpOnly: true, secure: false })
    // res.cookie('refreshToken', loginInfo.refreshToken, { httpOnly: true, secure: false })
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'No refresh token from cookies ');
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    // res.cookie('accessToken', tokenInfo.accessToken, { httpOnly: true, secure: false })
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: 'New accessToken retrived Successfully',
        success: true,
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken', { httpOnly: true, secure: env_1.envVars.NODE_ENV === "production", sameSite: 'none' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: env_1.envVars.NODE_ENV === "production", sameSite: 'none' });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: 'User Logout Successfully',
        success: true,
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = req.body;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: 'Password changed successfully',
        success: true,
        data: null,
    });
}));
const googleCallbackController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log(user)
    let redirectTo = req.query.state ? req.query.state : '';
    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1);
    }
    // eslint-disable-next-line no-console
    console.log('user', user);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'No user found');
    }
    const tokenInfo = yield (0, userToken_1.createUserTokens)(user);
    // console.log(tokenInfo)
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
};
