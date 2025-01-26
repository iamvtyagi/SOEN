import {Router} from "express";
import {body} from "express-validator";
import  {createProjectController, getAllProjectsController, addUserToProjectController} from "../controllers/project.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/create", authMiddleware.authUser , [
    body("name").isString().withMessage("name is required"),
    // body("userId").isLength({min: 3}).withMessage("userId must be at least 3 characters long"),
], createProjectController);


router.get("/all",authMiddleware.authUser , getAllProjectsController);


router.put('add-user',
    authMiddleware.authUser,
    body('users').isArray({min: 1}).withMessage("users must be an array").bail()
    .custom((users) => users.every((user) => typeof user === 'string')).withMessage("users must be an array of strings"),
    addUserToProjectController
)




export default router