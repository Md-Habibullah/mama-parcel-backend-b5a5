"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
// Status log schema
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
}, {
    versionKey: false,
    _id: false
});
// Parcel schema
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    parcelType: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    pickupAddress: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
    },
    statusLogs: {
        type: [statusLogSchema],
        default: [],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, versionKey: false });
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
