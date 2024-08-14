import express from "express";
import multer from "multer"
import { hotelController } from "../Controllers/hotel.controller";
import { verifyToken } from "../Middlewares/auth";
import { createHotelValidation } from "../Validators/hotel.validator";
import { body } from "express-validator";
const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    }
})

router.post("/create", verifyToken, createHotelValidation, upload.array("imageFiles", 6), hotelController.create)

export default router