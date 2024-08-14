import { Request, Response } from 'express';
import cloudinary from "cloudinary"
import Hotel, { HotelType } from '../Models/hotel';
export const hotelController = {
    create: async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];

            const newHotel: HotelType = req.body
            //upload image to cloudinary
            const imageUrls = await uploadImages(imageFiles);

            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            console.log("newHotel: ", newHotel)

            //create hotel
            const hotel = new Hotel(newHotel)
            await hotel.save();

            res.status(201).json({
                message: "Create hotel successfully",
                data: hotel
            })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    findByUserId: async (req: Request, res: Response) => {
        try {
            const hotels = await Hotel.find({ userId: req.userId })
            res.json(hotels)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    findById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id.toString();
            const hotel = await Hotel.findOne({
                _id: id,
                userId: req.userId
            })
            res.json(hotel);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const updateHotel: HotelType = req.body;
            updateHotel.lastUpdated = new Date();

            const hotel = await Hotel.findOneAndUpdate({
                _id: req.params.hotelId,
                userId: req.userId
            }, updateHotel, { new: true })

            if (hotel != null) {
                const files = req.files as Express.Multer.File[];
                const updateImageUrls = await uploadImages(files);
                hotel.imageUrls = [...updateImageUrls, ...(updateHotel.imageUrls || [])];
                await hotel.save();
                res.status(200).json(hotel)
            } else {
                res.status(404).json({
                    message: "Hotel not found"
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    }
}
async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

