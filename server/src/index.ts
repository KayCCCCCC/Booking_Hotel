import express, { Request, Response } from "express";
import cors from "cors"
import "dotenv/config"
import mongoose from 'mongoose';
import router from "./Routers/index";
import cookieParser from "cookie-parser"
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log("Connected Db Success");
})

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors({
    origin: process.env.FRONTEND_URL ?? "https://mern-booking-app-m5si.onrender.com",
    credentials: true
}))

app.use(express.static(path.join(__dirname, "../../client/dist"))) // match with client to deploy

app.use("/api", router)

// app.get("*", (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
// })

app.listen(7000, () => {
    console.log("server running on localhost:7000")
})