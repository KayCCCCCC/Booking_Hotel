import express from "express";
import { userController } from "../Controllers/user.controller";
import { registerValidation } from "../Validators/user.validator";
import { verifyToken } from "../Middlewares/auth";
const router = express.Router()

router.get("/get-info", verifyToken, userController.getInfo)
router.post("/register", registerValidation, userController.register)

export default router