import { Router } from "express";
import { activateUser, allUser, deactivateUser } from "../controllers/admin.controller.js";


export const adminRoutes=Router();

adminRoutes.route("/allUser").get(allUser);
adminRoutes.route("/deactivateUser").post(deactivateUser);
adminRoutes.route("/activateUser").post(activateUser);