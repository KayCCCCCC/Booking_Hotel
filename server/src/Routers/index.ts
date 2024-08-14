import express from "express";
import userRouter from "../Routers/user.router"
import authRouter from "../Routers/auth.router"
import hotelRouter from "../Routers/hotel.router"
const router = express.Router()

router.use("/user", userRouter)
router.use("/auth", authRouter)
router.use("/hotel", hotelRouter)

export default router