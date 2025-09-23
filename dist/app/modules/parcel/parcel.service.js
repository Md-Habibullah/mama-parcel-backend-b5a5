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
exports.ParcelServices = void 0;
const parcel_model_1 = require("./parcel.model");
const parcel_interface_1 = require("./parcel.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getTrackingId_1 = require("../../utils/getTrackingId");
const user_interface_1 = require("../user/user.interface");
// sender
const createParcel = (senderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield user_model_1.User.findById(senderId);
    if (!sender)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender not found");
    const receiver = yield user_model_1.User.findById(payload.receiver);
    if (!receiver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found");
    const trackingId = yield (0, getTrackingId_1.generateTrackingId)();
    const parcel = yield parcel_model_1.Parcel.create({
        trackingId,
        sender: sender._id,
        receiver: payload.receiver,
        parcelType: payload.parcelType,
        weight: payload.weight,
        pickupAddress: payload.pickupAddress,
        deliveryAddress: payload.deliveryAddress,
        fee: payload.fee,
        currentStatus: parcel_interface_1.ParcelStatus.REQUESTED,
        statusLogs: [
            {
                status: parcel_interface_1.ParcelStatus.REQUESTED,
                updatedBy: sender._id,
                note: "Parcel created by sender",
                timestamp: new Date(),
            },
        ],
    });
    return parcel;
});
const cancelParcel = (senderId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.sender.toString() !== senderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You cannot cancel this parcel");
    }
    if (![parcel_interface_1.ParcelStatus.REQUESTED, parcel_interface_1.ParcelStatus.APPROVED].includes(parcel.currentStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel cannot be canceled now");
    }
    parcel.currentStatus = parcel_interface_1.ParcelStatus.CANCELED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.CANCELED,
        updatedBy: new mongoose_1.Types.ObjectId(senderId),
        note: "Parcel canceled by sender",
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const getParcelsBySender = (senderId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({ sender: senderId }).populate("receiver", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType"])
        .sort()
        .paginate()
        .fields();
    const result = yield queryBuilder.build();
    const meta = yield queryBuilder.getMeta();
    return { meta, data: result };
});
const getReceiverIdByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User not exists");
    }
    if (user.role !== "RECEIVER") {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "This user is not able to receive the parcel");
    }
    return user;
});
// receiver
const getParcelsByReceiver = (receiverId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({ receiver: receiverId }).populate("sender", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType"])
        .sort()
        .paginate()
        .fields();
    const result = yield queryBuilder.build();
    const meta = yield queryBuilder.getMeta();
    return { meta, data: result };
});
const confirmDelivery = (receiverId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.receiver.toString() !== receiverId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You cannot confirm this parcel");
    }
    if (parcel.currentStatus !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel is not in transit");
    }
    parcel.currentStatus = parcel_interface_1.ParcelStatus.DELIVERED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        updatedBy: new mongoose_1.Types.ObjectId(receiverId),
        note: "Receiver confirmed delivery",
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const getDeliveryHistoryByReceiver = (receiverId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({ receiver: receiverId, currentStatus: parcel_interface_1.ParcelStatus.DELIVERED }).populate("sender", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType"])
        .sort()
        .paginate()
        .fields();
    const result = yield queryBuilder.build();
    const meta = yield queryBuilder.getMeta();
    return { meta, data: result };
});
// Admin
const getAllParcels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find().populate("sender", "name email").populate("receiver", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType", "pickupAddress", "deliveryAddress"])
        .sort()
        .paginate()
        .fields();
    const result = yield queryBuilder.build();
    const meta = yield queryBuilder.getMeta();
    return { meta, data: result };
});
const updateParcelStatus = (adminId, parcelId, status, note) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.isBlocked)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel is blocked");
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.CANCELED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Canceled parcel cannot be updated");
    }
    parcel.currentStatus = status;
    parcel.statusLogs.push({
        status,
        updatedBy: new mongoose_1.Types.ObjectId(adminId),
        note: note || `Status changed to ${status}`,
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const toggleBlockParcel = (adminId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    parcel.isBlocked = !parcel.isBlocked;
    parcel.statusLogs.push({
        status: parcel.isBlocked ? parcel_interface_1.ParcelStatus.CANCELED : parcel.currentStatus,
        updatedBy: new mongoose_1.Types.ObjectId(adminId),
        note: parcel.isBlocked ? "Parcel blocked by admin" : "Parcel unblocked by admin",
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield user_model_1.User.countDocuments();
    const totalParcels = yield parcel_model_1.Parcel.countDocuments();
    const deliveredParcels = yield parcel_model_1.Parcel.countDocuments({ currentStatus: parcel_interface_1.ParcelStatus.DELIVERED });
    const cancelledParcels = yield parcel_model_1.Parcel.countDocuments({ currentStatus: parcel_interface_1.ParcelStatus.CANCELED });
    const delivered = yield parcel_model_1.Parcel.countDocuments({ currentStatus: parcel_interface_1.ParcelStatus.DELIVERED });
    const canceled = yield parcel_model_1.Parcel.countDocuments({ currentStatus: parcel_interface_1.ParcelStatus.CANCELED });
    const inTransit = yield parcel_model_1.Parcel.countDocuments({ currentStatus: parcel_interface_1.ParcelStatus.IN_TRANSIT });
    const pendingParcels = totalParcels - (deliveredParcels + cancelledParcels + inTransit);
    return {
        totalUsers,
        totalParcels,
        pendingParcels,
        inTransit,
        delivered,
        canceled,
    };
});
// for all
const getParcelById = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId)
        .populate("sender receiver", "name email")
        .populate({
        path: "statusLogs.updatedBy",
        select: "name email"
    });
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    return parcel;
});
const trackParcel = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId })
        .populate("sender", "name email").populate("receiver", "name email").populate({
        path: "statusLogs.updatedBy",
        select: "name email"
    });
    // .select("trackingId currentStatus statusLogs pickupAddress deliveryAddress");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    return parcel;
});
const returnParcel = (userId, role, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.RETURNED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel already returned");
    }
    if (role === user_interface_1.Role.RECEIVER && parcel.receiver.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to return this parcel");
    }
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.DELIVERED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Delivered parcels cannot be returned");
    }
    parcel.currentStatus = parcel_interface_1.ParcelStatus.RETURNED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.RETURNED,
        updatedBy: new mongoose_1.Types.ObjectId(userId),
        note: "Parcel returned",
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
exports.ParcelServices = {
    createParcel,
    cancelParcel,
    getParcelsBySender,
    getReceiverIdByEmail,
    getParcelsByReceiver,
    confirmDelivery,
    getAllParcels,
    updateParcelStatus,
    toggleBlockParcel,
    getParcelById,
    trackParcel,
    getStats,
    returnParcel,
    getDeliveryHistoryByReceiver
};
