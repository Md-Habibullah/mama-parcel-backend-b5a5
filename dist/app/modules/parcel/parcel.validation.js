"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelZodSchema = zod_1.default.object({
    receiver: zod_1.default
        .string({ required_error: "Receiver ID is required" })
        .regex(/^[a-f\d]{24}$/i, "Receiver must be a valid MongoDB ObjectId"),
    parcelType: zod_1.default
        .string({ required_error: "Parcel type is required" })
        .min(2, "Parcel type must be at least 2 characters long"),
    weight: zod_1.default
        .number({ required_error: "Weight is required" })
        .positive("Weight must be a positive number"),
    pickupAddress: zod_1.default
        .string({ required_error: "Pickup address is required" })
        .min(5, "Pickup address must be at least 5 characters"),
    deliveryAddress: zod_1.default
        .string({ required_error: "Delivery address is required" })
        .min(5, "Delivery address must be at least 5 characters"),
    fee: zod_1.default
        .number({ required_error: "Fee is required" })
        .nonnegative("Fee must be a non-negative number"),
});
exports.updateParcelStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum(Object.values(parcel_interface_1.ParcelStatus), {
        required_error: "Status is required",
    }),
    note: zod_1.default
        .string()
        .max(200, "Note cannot exceed 200 characters")
        .optional(),
});
