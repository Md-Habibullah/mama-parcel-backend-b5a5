"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2).max(50),
    email: zod_1.default.string().email().min(5).max(100),
    password: zod_1.default.string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Password must contain at least 1 number."),
    phone: zod_1.default.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be valid for Bangladesh.").optional(),
    address: zod_1.default.string().max(200).optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2).max(50).optional(),
    password: zod_1.default.string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Password must contain at least 1 number.")
        .optional(),
    phone: zod_1.default.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be valid for Bangladesh.").optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(), // CHANGED
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDeleted: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
    address: zod_1.default.string().max(200).optional()
});
