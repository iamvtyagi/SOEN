import {Router} from "express";
import {body} from "express-validator";
import {createProjectController} from "../controllers/project.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/create", authMiddleware.authUser , [
    body("name").isString().withMessage("name is required"),
    // body("userId").isLength({min: 3}).withMessage("userId must be at least 3 characters long"),
], createProjectController);


export default router