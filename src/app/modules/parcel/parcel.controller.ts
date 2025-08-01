/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { ParcelServices } from "./parcel.service";


// sender
const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const senderId = (req.user as JwtPayload).userId;
    const parcel = await ParcelServices.createParcel(senderId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "Parcel created successfully",
        success: true,
        data: parcel,
    });
});

const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const senderId = (req.user as JwtPayload).userId;
    const parcelId = req.params.id;

    const updatedParcel = await ParcelServices.cancelParcel(senderId, parcelId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Parcel canceled successfully",
        success: true,
        data: updatedParcel,
    });
});

const getMyParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const senderId = (req.user as JwtPayload).userId;
    const result = await ParcelServices.getParcelsBySender(senderId, req.query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Sender parcels retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
});

// receiver
const getIncomingParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const receiverId = (req.user as JwtPayload).userId;
    const result = await ParcelServices.getParcelsByReceiver(receiverId, req.query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Incoming parcels retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
});

const confirmDelivery = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const receiverId = (req.user as JwtPayload).userId;
    const parcelId = req.params.id;

    const updatedParcel = await ParcelServices.confirmDelivery(receiverId, parcelId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Delivery confirmed successfully",
        success: true,
        data: updatedParcel,
    });
});

const getDeliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const receiverId = (req.user as JwtPayload).userId;
    const result = await ParcelServices.getDeliveryHistoryByReceiver(receiverId, req.query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Delivery history retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
});


// admin
const getAllParcels = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ParcelServices.getAllParcels(req.query as Record<string, string>);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "All parcels retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
});

const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req.user as JwtPayload).userId;
    const parcelId = req.params.id;
    const { status, note } = req.body;

    const updatedParcel = await ParcelServices.updateParcelStatus(adminId, parcelId, status, note);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Parcel status updated successfully",
        success: true,
        data: updatedParcel,
    });
});

const blockOrUnblockParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req.user as JwtPayload).userId;
    const parcelId = req.params.id;

    const updatedParcel = await ParcelServices.toggleBlockParcel(adminId, parcelId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Parcel block/unblock status updated successfully",
        success: true,
        data: updatedParcel,
    });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelServices.getStats();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Parcel stats retrieved successfully",
        success: true,
        data: result,
    });
});


// for all
const getParcelById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parcelId = req.params.id;
    const parcel = await ParcelServices.getParcelById(parcelId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Parcel details retrieved successfully",
        success: true,
        data: parcel,
    });
});

const trackParcel = catchAsync(async (req: Request, res: Response) => {
    const { trackingId } = req.params;
    const result = await ParcelServices.trackParcel(trackingId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Tracking info retrieved successfully",
        success: true,
        data: result,
    });
});

const returnParcel = catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user as JwtPayload).userId;
    const userRole = (req.user as JwtPayload).role;
    const parcelId = req.params.id;

    const result = await ParcelServices.returnParcel(userId, userRole, parcelId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Parcel returned successfully",
        success: true,
        data: result,
    });
});



export const ParcelControllers = {
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
