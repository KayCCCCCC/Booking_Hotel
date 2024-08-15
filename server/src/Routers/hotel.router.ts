import express from "express";
import multer from "multer"
import { hotelController } from "../Controllers/hotel.controller";
import { verifyToken } from "../Middlewares/auth";
import { createHotelValidation } from "../Validators/hotel.validator";

const router = express.Router()

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb                                       
    }
})

// my hotel
router.post("/create", verifyToken, createHotelValidation, upload.array("imageFiles", 6), hotelController.create)
router.get("/get-by-userId", verifyToken, hotelController.findByUserId)
router.get("/get-by-id/:id", verifyToken, hotelController.findById)
router.put("/update/:hotelId", verifyToken, upload.array("imageFiles", 6), hotelController.update)

// hotel 
router.get("/search", hotelController.search)
router.get("/get-all", hotelController.getAll)
router.get("/get/:id", hotelController.getById)
router.post("/:hotelId/booking/payment-intent", verifyToken, hotelController.paymentStripe)
router.post("/:hotelId/booking", verifyToken, hotelController.booking)

export default router