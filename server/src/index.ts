import express, { Request, Response } from "express";
import cors from "cors"
import "dotenv/config"
import mongoose from 'mongoose';
import router from "./Routers/index";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
    console.log("Connected Db Success");
})

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/api", router)

app.listen(7000, () => {
    console.log("server running on localhost:7000")
})