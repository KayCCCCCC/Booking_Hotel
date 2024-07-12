import express from "express";
import userRouter from "../Routers/user.router"
import authRouter from "../Routers/auth.router"
const router = express.Router()

router.use("/user", userRouter)
router.use("/auth", authRouter)

export default router