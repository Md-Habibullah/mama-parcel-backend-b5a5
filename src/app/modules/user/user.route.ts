import { Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post('/register', validateRequest(createUserZodSchema), userControllers.createUser);
router.get('/me', checkAuth(...Object.values(Role)), userControllers.getMyProfile);
router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUsers);
router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser);
router.patch('/block/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.blockUser);
router.patch('/unblock/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.unblockUser);

export const UserRoutes = router;