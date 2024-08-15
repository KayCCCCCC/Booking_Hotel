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
    },
    search: async (req: Request, res: Response) => {
        try {
            const query = constructSearchQuery(req.query);

            console.log(req.query)
            let sortOptions = {};
            switch (req.query.sortOption) {
                case "starRating":
                    sortOptions = { starRating: -1 };
                    break;
                case "pricePerNightAsc":
                    sortOptions = { pricePerNight: 1 };
                    break;
                case "pricePerNightDesc":
                    sortOptions = { pricePerNight: -1 };
                    break;
            }

            const pageSize = 5;
            const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
            const skip = (pageNumber - 1) * pageSize

            const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
            const total = await Hotel.countDocuments(query);

            const response = {
                data: hotels,
                pagination: {
                    total,
                    page: pageNumber,
                    totalPage: Math.ceil(total / pageSize)
                }
            }
            res.json(response)
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


const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    // RegExp(queryParams.destination, "i") tạo một biểu thức chính quy (regular expression), "i" là flag để không phân biệt chữ hoa thường).
    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    // hàm sẽ tạo điều kiện tìm kiếm sao cho tất cả các tiện nghi trong mảng facilities phải có mặt ($all) trong mục đó.
    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }

    return constructedQuery;
};

