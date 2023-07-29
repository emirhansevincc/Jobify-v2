import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

import { validateTest } from "./middleware/validationMiddleware.js";

// Routers
import jobRouter from "./routes/jobRouter.js";

// Middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/api/v1/test", validateTest, (req, res) => {
    const { name } = req.body;
    res.json(`Hello ${name}`);
})

app.use("/api/v1/jobs", jobRouter);

app.use("*", (req, res) => {
    res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`server running on PORT ${port}....`);
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}