import { Router } from "express";
import { ParcelControllers } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createParcelZodSchema, updateParcelStatusZodSchema } from "./parcel.validation";

const router = Router();

// sender
router.post("/", checkAuth(Role.SENDER), validateRequest(createParcelZodSchema), ParcelControllers.createParcel);
router.patch("/cancel/:id", checkAuth(Role.SENDER), ParcelControllers.cancelParcel);
router.get("/my-parcels", checkAuth(Role.SENDER), ParcelControllers.getMyParcels);
router.get("/find-by-email/:email", checkAuth(Role.SENDER), ParcelControllers.getReceiverIdByEmail);

// receiver
router.get("/incoming", checkAuth(Role.RECEIVER), ParcelControllers.getIncomingParcels);
router.patch("/confirm-delivery/:id", checkAuth(Role.RECEIVER), ParcelControllers.confirmDelivery);
router.get("/history", checkAuth(Role.RECEIVER), ParcelControllers.getDeliveryHistory);

// admin
router.get("/all-parcels", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.getAllParcels);
router.patch("/status/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateParcelStatusZodSchema), ParcelControllers.updateParcelStatus);
router.patch("/block/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.blockOrUnblockParcel);
router.get("/stats", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ParcelControllers.getStats);

// for all
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER, Role.RECEIVER), ParcelControllers.getParcelById);
router.get("/track/:trackingId", ParcelControllers.trackParcel);

// admin and receiver
router.patch("/return/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.RECEIVER), ParcelControllers.returnParcel);

export const ParcelRoutes = router;