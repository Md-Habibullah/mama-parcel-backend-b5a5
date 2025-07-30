import { Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router()

router.post('/register', validateRequest(createUserZodSchema), userControllers.createUser)
router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUsers)
router.patch('/:id', validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userControllers.updateUser)

export const UserRoutes = router;