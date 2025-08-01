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
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
// sender
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const parcel = yield parcel_service_1.ParcelServices.createParcel(senderId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        success: true,
        data: parcel,
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const parcelId = req.params.id;
    const updatedParcel = yield parcel_service_1.ParcelServices.cancelParcel(senderId, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel canceled successfully",
        success: true,
        data: updatedParcel,
    });
}));
const getMyParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const result = yield parcel_service_1.ParcelServices.getParcelsBySender(senderId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Sender parcels retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
// receiver
const getIncomingParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverId = req.user.userId;
    const result = yield parcel_service_1.ParcelServices.getParcelsByReceiver(receiverId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming parcels retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
const confirmDelivery = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverId = req.user.userId;
    const parcelId = req.params.id;
    const updatedParcel = yield parcel_service_1.ParcelServices.confirmDelivery(receiverId, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Delivery confirmed successfully",
        success: true,
        data: updatedParcel,
    });
}));
const getDeliveryHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverId = req.user.userId;
    const result = yield parcel_service_1.ParcelServices.getDeliveryHistoryByReceiver(receiverId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Delivery history retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
// admin
const getAllParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelServices.getAllParcels(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "All parcels retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.user.userId;
    const parcelId = req.params.id;
    const { status, note } = req.body;
    const updatedParcel = yield parcel_service_1.ParcelServices.updateParcelStatus(adminId, parcelId, status, note);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status updated successfully",
        success: true,
        data: updatedParcel,
    });
}));
const blockOrUnblockParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.user.userId;
    const parcelId = req.params.id;
    const updatedParcel = yield parcel_service_1.ParcelServices.toggleBlockParcel(adminId, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel block/unblock status updated successfully",
        success: true,
        data: updatedParcel,
    });
}));
const getStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelServices.getStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel stats retrieved successfully",
        success: true,
        data: result,
    });
}));
// for all
const getParcelById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const parcel = yield parcel_service_1.ParcelServices.getParcelById(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel details retrieved successfully",
        success: true,
        data: parcel,
    });
}));
const trackParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackingId } = req.params;
    const result = yield parcel_service_1.ParcelServices.trackParcel(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Tracking info retrieved successfully",
        success: true,
        data: result,
    });
}));
const returnParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const parcelId = req.params.id;
    const result = yield parcel_service_1.ParcelServices.returnParcel(userId, userRole, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel returned successfully",
        success: true,
        data: result,
    });
}));
exports.ParcelControllers = {
    createParcel,
    cancelParcel,
    getMyParcels,
    getIncomingParcels,
    confirmDelivery,
    getAllParcels,
    updateParcelStatus,
    blockOrUnblockParcel,
    getParcelById,
    trackParcel,
    getStats,
    returnParcel,
    getDeliveryHistory
};
