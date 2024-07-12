import express from "express";
import { userController } from "../Controllers/user.controller";
import { registerValidation } from "../Validators/user.validator";
const router = express.Router()

router.post("/register", registerValidation, userController.register)

export default router