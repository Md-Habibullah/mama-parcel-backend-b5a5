import { Types } from "mongoose";

export enum ParcelStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    RETURNED = "RETURNED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    CANCELED = "CANCELED"
}

// Status log subdocument interface
export interface IStatusLog {
    status: ParcelStatus;
    updatedBy: Types.ObjectId;
    note?: string;
    timestamp: Date;
}

export interface IParcel {
    _id?: Types.ObjectId;
    trackingId: string;
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    parcelType: string;
    weight: number;
    pickupAddress: string;
    deliveryAddress: string;
    fee: number;
    currentStatus: ParcelStatus;
    statusLogs: IStatusLog[];
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
