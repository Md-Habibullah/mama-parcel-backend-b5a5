import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().min(5).max(100),
    password: z.string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Password must contain at least 1 number."),
    phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be valid for Bangladesh.").optional(),
    address: z.string().max(200).optional(),
    role: z.enum(Object.values(Role) as [string]).optional()
});

export const updateUserZodSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    password: z.string()
        .min(8)
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter.")
        .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least 1 special character.")
        .regex(/^(?=.*\d)/, "Password must contain at least 1 number.")
        .optional(),
    phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, "Phone number must be valid for Bangladesh.").optional(),
    role: z.enum(Object.values(Role) as [string]).optional(), // CHANGED
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isDeleted: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    address: z.string().max(200).optional()
});
