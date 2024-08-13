import express from "express";
import { loginValidation } from "../Validators/auth.validator";
import { AuthController } from './../Controllers/auth.controller';
import { verifyToken } from "../Middlewares/auth";

const router = express.Router()

router.post("/login", loginValidation, AuthController.login)
router.post("/logout", AuthController.logOut)
router.get("/validate-token", verifyToken, AuthController.validateToken)

export default router