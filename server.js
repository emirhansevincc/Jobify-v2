import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

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

app.post("/api/v1/test", [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 50 }).withMessage('Name must be min 50 char. '), (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessage = errors.array().map((error) => error.msg);
                return res.status(400).json({ errors: errorMessage });
            }
            next();
        }
],
    (req, res) => {
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