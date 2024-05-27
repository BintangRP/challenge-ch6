import express from "express";
import { db } from "./database/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import loginRoute from "./routes/loginRoute.js";
import carRoute from "./routes/carRoute.js";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import Cars from "./models/CarModel.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(loginRoute);
app.use(carRoute);
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000", }));

try {
    await db.authenticate();
    console.log('DB Connected Successfully');
    (async () => {
        await db.sync();
        await Cars.sync();
    })();
} catch (error) {
    console.log(error.message);
}

app.listen(process.env.PORT, () => {
    console.log(`server up on http://localhost:${process.env.PORT}`);
});