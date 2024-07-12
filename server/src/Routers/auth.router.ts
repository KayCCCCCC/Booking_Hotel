import express from "express";
import { loginValidation } from "../Validators/auth.validator";
import { AuthController } from './../Controllers/auth.controller';

const router = express.Router()

router.post("/login", loginValidation, AuthController.login)

export default router