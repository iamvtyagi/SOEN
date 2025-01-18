import express from "express";
const router = express.Router();
import * as userController from "../controllers/user.controller.js";
import {body} from "express-validator";
import * as authMiddleware from "../middlewares/auth.middleware.js";

router.post("/register", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min: 3}).withMessage("Password must be at least 3 characters long"),
],userController.createUserController);

router.post("/login", [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({min: 3}).withMessage("Password must be at least 3 characters long"),
],userController.loginUserController);

router.get("/profile",authMiddleware.authUser ,userController.profileUserController);

router.get("/logout",authMiddleware.authUser ,userController.logoutUserController);


export default router;