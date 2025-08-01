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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: 'User created successfully',
        success: true,
        data: user,
    });
}));
const getMyProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const user = yield user_service_1.UserServices.getUserById(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: 'Profile retrieved successfully',
        success: true,
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: 'users retreive successfully',
    //     users
    // })
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: 'All users retreive successfully',
        success: true,
        data: result.data,
        meta: result.meta
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = yield user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: 'User updated successfully',
        success: true,
        data: user,
    });
}));
const blockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const decodedId = req.user.userId;
    const result = yield user_service_1.UserServices.blockUser(userId, decodedId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: 'User blocked successfully',
        success: true,
        data: result,
    });
}));
const unblockUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_service_1.UserServices.unblockUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: 'User unblocked successfully',
        success: true,
        data: result,
    });
}));
exports.userControllers = {
    createUser,
    getMyProfile,
    getAllUsers,
    updateUser,
    blockUser,
    unblockUser
};
