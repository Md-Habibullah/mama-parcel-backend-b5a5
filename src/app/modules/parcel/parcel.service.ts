import { Parcel } from "./parcel.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";
import { User } from "../user/user.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { generateTrackingId } from "../../utils/getTrackingId";
import { Role } from "../user/user.interface";


// sender
const createParcel = async (senderId: string, payload: Partial<IParcel>) => {
    const sender = await User.findById(senderId);
    if (!sender) throw new AppError(httpStatus.NOT_FOUND, "Sender not found");

    const receiver = await User.findById(payload.receiver);

    if (!receiver) throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");

    const trackingId = await generateTrackingId();

    const parcel = await Parcel.create({
        trackingId,
        sender: sender._id,
        receiver: payload.receiver,
        parcelType: payload.parcelType,
        weight: payload.weight,
        pickupAddress: payload.pickupAddress,
        deliveryAddress: payload.deliveryAddress,
        fee: payload.fee,
        currentStatus: ParcelStatus.REQUESTED,
        statusLogs: [
            {
                status: ParcelStatus.REQUESTED,
                updatedBy: sender._id,
                note: "Parcel created by sender",
                timestamp: new Date(),
            },
        ],
    });

    return parcel;
};

const cancelParcel = async (senderId: string, parcelId: string) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

    if (parcel.sender.toString() !== senderId) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot cancel this parcel");
    }

    if (![ParcelStatus.REQUESTED, ParcelStatus.APPROVED].includes(parcel.currentStatus)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel cannot be canceled now");
    }

    parcel.currentStatus = ParcelStatus.CANCELED;

    parcel.statusLogs.push({
        status: ParcelStatus.CANCELED,
        updatedBy: new Types.ObjectId(senderId),
        note: "Parcel canceled by sender",
        timestamp: new Date(),
    });

    await parcel.save();
    return parcel;
};

const getParcelsBySender = async (senderId: string, query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Parcel.find({ sender: senderId }).populate("receiver", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType"])
        .sort()
        .paginate()
        .fields();

    const result = await queryBuilder.build();
    const meta = await queryBuilder.getMeta();

    return { meta, data: result };
};

const getReceiverIdByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(httpStatus.FORBIDDEN, "User not exists");
    }

    if (user.role !== "RECEIVER") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is not able to receive the parcel");
    }
    return user;
}

// receiver
const getParcelsByReceiver = async (receiverId: string, query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Parcel.find({ receiver: receiverId }).populate("sender", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType"])
        .sort()
        .paginate()
        .fields();

    const result = await queryBuilder.build();
    const meta = await queryBuilder.getMeta();

    return { meta, data: result };
};

const confirmDelivery = async (receiverId: string, parcelId: string) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

    if (parcel.receiver.toString() !== receiverId) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot confirm this parcel");
    }

    if (parcel.currentStatus !== ParcelStatus.IN_TRANSIT) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel is not in transit");
    }

    parcel.currentStatus = ParcelStatus.DELIVERED;

    parcel.statusLogs.push({
        status: ParcelStatus.DELIVERED,
        updatedBy: new Types.ObjectId(receiverId),
        note: "Receiver confirmed delivery",
        timestamp: new Date(),
    });

    await parcel.save();
    return parcel;
};

const getDeliveryHistoryByReceiver = async (receiverId: string, query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Parcel.find({ receiver: receiverId, currentStatus: ParcelStatus.DELIVERED }).populate("sender", "name email"), query)
        .filter()
        .search(["trackingId", "parcelType"])
        .sort()
        .paginate()
        .fields();

    const result = await queryBuilder.build();
    const meta = await queryBuilder.getMeta();

    return { meta, data: result };
};

// Admin
const getAllParcels = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
        Parcel.find().populate("sender", "name email").populate("receiver", "name email"),
        query
    )
        .filter()
        .search(["trackingId", "parcelType", "pickupAddress", "deliveryAddress"])
        .sort()
        .paginate()
        .fields();

    const result = await queryBuilder.build();
    const meta = await queryBuilder.getMeta();

    return { meta, data: result };
};



const updateParcelStatus = async (adminId: string, parcelId: string, status: ParcelStatus, note?: string) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

    if (parcel.isBlocked) throw new AppError(httpStatus.NOT_FOUND, "Parcel is blocked");

    if (parcel.currentStatus === ParcelStatus.CANCELED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Canceled parcel cannot be updated");
    }

    parcel.currentStatus = status;

    parcel.statusLogs.push({
        status,
        updatedBy: new Types.ObjectId(adminId),
        note: note || `Status changed to ${status}`,
        timestamp: new Date(),
    });

    await parcel.save();
    return parcel;
};

const toggleBlockParcel = async (adminId: string, parcelId: string) => {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

    parcel.isBlocked = !parcel.isBlocked;

    parcel.statusLogs.push({
        status: parcel.isBlocked ? ParcelStatus.CANCELED : parcel.currentStatus,
        updatedBy: new Types.ObjectId(adminId),
        note: parcel.isBlocked ? "Parcel blocked by admin" : "Parcel unblocked by admin",
        timestamp: new Date(),
    });

    await parcel.save();
    return parcel;
};

const getStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalParcels = await Parcel.countDocuments();
    const deliveredParcels = await Parcel.countDocuments({ currentStatus: ParcelStatus.DELIVERED });
    const cancelledParcels = await Parcel.countDocuments({ currentStatus: ParcelStatus.CANCELED });
    const delivered = await Parcel.countDocuments({ currentStatus: ParcelStatus.DELIVERED });
    const canceled = await Parcel.countDocuments({ currentStatus: ParcelStatus.CANCELED });
    const inTransit = await Parcel.countDocuments({ currentStatus: ParcelStatus.IN_TRANSIT });
    const pendingParcels = totalParcels - (deliveredParcels + cancelledParcels + inTransit);

    return {
        totalUsers,
        totalParcels,
        pendingParcels,
        inTransit,
        delivered,
        canceled,
    };
};

// for all
const getParcelById = async (parcelId: string) => {

    const parcel = await Parcel.findById(parcelId)
        .populate("sender receiver", "name email")
        .populate({
            path: "statusLogs.updatedBy",
            select: "name email"
        });

    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

    return parcel;
};

const trackParcel = async (trackingId: string) => {
    const parcel = await Parcel.findOne({ trackingId })
        .populate("sender", "name email").populate("receiver", "name email").populate({
            path: "statusLogs.updatedBy",
            select: "name email"
        });
    // .select("trackingId currentStatus statusLogs pickupAddress deliveryAddress");
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }
    return parcel;
};

const returnParcel = async (userId: string, role: string, parcelId: string) => {

    const parcel = await Parcel.findById(parcelId);

    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

    if (parcel.currentStatus === ParcelStatus.RETURNED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Parcel already returned");
    }

    if (role === Role.RECEIVER && parcel.receiver.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to return this parcel");
    }

    if (parcel.currentStatus === ParcelStatus.DELIVERED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Delivered parcels cannot be returned");
    }

    parcel.currentStatus = ParcelStatus.RETURNED;

    parcel.statusLogs.push({
        status: ParcelStatus.RETURNED,
        updatedBy: new Types.ObjectId(userId),
        note: "Parcel returned",
        timestamp: new Date(),
    });

    await parcel.save();
    return parcel;
};


export const ParcelServices = {
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