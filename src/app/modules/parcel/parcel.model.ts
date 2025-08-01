import { Schema, model } from "mongoose";
import { IParcel, IStatusLog, ParcelStatus } from "./parcel.interface";

// Status log schema
const statusLogSchema = new Schema<IStatusLog>({
    status: {
        type: String,
        enum: Object.values(ParcelStatus),
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
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
const parcelSchema = new Schema<IParcel>({
    trackingId: {
        type: String,
        required: true,
        unique: true,
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    receiver: {
        type: Schema.Types.ObjectId,
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
        enum: Object.values(ParcelStatus),
        default: ParcelStatus.REQUESTED,
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

export const Parcel = model<IParcel>("Parcel", parcelSchema);
