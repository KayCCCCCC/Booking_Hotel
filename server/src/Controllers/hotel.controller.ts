import { Request, Response } from 'express';
import cloudinary from "cloudinary"
import Hotel, { HotelType } from '../Models/hotel';
import Stripe from "stripe";
import Booking, { BookingType } from '../Models/booking';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)
export const hotelController = {
    getAll: async (req: Request, res: Response) => {
        try {
            const hotels = await Hotel.find().sort("-lastUpdated")
            res.json(hotels)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
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
    },
    getById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id.toString();
            if (!id) {
                res.status(400).json({
                    message: "Id of hotel is required"
                })
            }
            const hotel = await Hotel.findById(id)
            if (!hotel) {
                res.status(404).json({
                    message: "Hotel is not found"
                })
            }
            res.json(hotel);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    paymentStripe: async (req: Request, res: Response) => {
        try {
            const { numberOfNights } = req.body;
            const hotelId = req.params.hotelId;

            const hotel = await Hotel.findById(hotelId)
            if (hotel) {
                const totalCost = hotel?.pricePerNight * numberOfNights
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: totalCost,
                    currency: "usd",
                    metadata: {
                        hotelId,
                        userId: req.userId
                    }
                })
                if (!paymentIntent.client_secret) {
                    return res.status(500).json({
                        message: "Error creating payment intent"
                    })
                }
                const response = {
                    paymentIntentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret.toString(),
                    totalCost
                }
                res.send(response)
            } else {
                res.status(404).json({ message: "Hotel not found" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    },
    booking: async (req: Request, res: Response) => {
        try {
            const paymentIntentId = req.body.paymentIntentId;

            const paymentIntent = await stripe.paymentIntents.retrieve(
                paymentIntentId as string
            );

            if (!paymentIntent) {
                return res.status(400).json({ message: "payment intent not found" });
            }

            if (
                paymentIntent.metadata.hotelId !== req.params.hotelId ||
                paymentIntent.metadata.userId !== req.userId
            ) {
                return res.status(400).json({ message: "payment intent mismatch" });
            }

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
                });
            }

            const newBooking: BookingType = {
                ...req.body,
                userId: req.userId,
            };

            const booking = new Booking(newBooking)
            await booking.save();

            const hotel = await Hotel.findOneAndUpdate(
                { _id: req.params.hotelId },
                {
                    $push: { bookings: newBooking },
                }
            );

            if (!hotel) {
                return res.status(400).json({ message: "hotel not found" });
            }

            await hotel.save();
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "something went wrong" });
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

