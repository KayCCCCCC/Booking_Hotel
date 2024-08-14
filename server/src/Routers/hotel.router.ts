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
router.get("/get-by-userId", verifyToken, hotelController.findByUserId)
router.get("/get-by-id/:id", verifyToken, hotelController.findById)
router.put("/update/:hotelId", verifyToken, upload.array("imageFiles", 6), hotelController.update)


export default router