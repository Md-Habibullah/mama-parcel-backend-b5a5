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
    updatedBy: Types.ObjectId; // admin or system user
    note?: string;             // optional note about the update
    timestamp: Date;
}

export interface IParcel {
    _id?: Types.ObjectId;

    trackingId: string;        // unique tracking code (e.g., TRK-20250730-000001)

    sender: Types.ObjectId;    // user with role SENDER
    receiver: Types.ObjectId;  // user with role RECEIVER

    parcelType: string;        // e.g., Document, Fragile Item, Electronics
    weight: number;            // in KG (or g, depending on requirement)
    pickupAddress: string;     // sender pickup location
    deliveryAddress: string;   // receiver delivery location

    fee: number;               // delivery charge

    currentStatus: ParcelStatus;
    statusLogs: IStatusLog[];  // full status change history

    isBlocked?: boolean;       // admin may block parcel
    createdAt?: Date;
    updatedAt?: Date;
}
