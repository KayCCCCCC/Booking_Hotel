import express from "express";
import { loginValidation } from "../Validators/auth.validator";
import { AuthController } from './../Controllers/auth.controller';
import { verifyToken } from "../Middlewares/Auth";

const router = express.Router()

router.post("/login", loginValidation, AuthController.login)
router.get("/validate-token", verifyToken, AuthController.validateToken)

export default router