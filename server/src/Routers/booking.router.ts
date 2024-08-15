import express from "express";
import { verifyToken } from "../Middlewares/auth";
import { BookingController } from "../Controllers/booking.controller";


const router = express.Router()

router.get("/get-booking", verifyToken, BookingController.getBooking)

export default router