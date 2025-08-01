import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const ifUserExist = await User.findOne({ email });

    if (ifUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = { provider: 'credentials', providerId: email as string };

    const user = await User.create({
        email,
        password: hashPassword,
        auths: [authProvider],
        ...rest,
        role: payload.role || Role.SENDER
    });

    return user;
};

const getUserById = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: { total: totalUsers }
    };
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (payload.role) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to change role');
        }
        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, 'Admin cannot assign SUPER_ADMIN');
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to modify status fields');
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hashSync(payload.password, envVars.BCRYPT_SALT_ROUND);
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return newUpdatedUser;
};

const blockUser = async (userId: string, decodedId: string) => {
    if (userId === decodedId) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot block yourself");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: IsActive.BLOCKED },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

const unblockUser = async (userId: string) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: IsActive.ACTIVE },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

export const UserServices = {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    blockUser,
    unblockUser
};
