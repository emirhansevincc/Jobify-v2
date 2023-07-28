import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// Routers
import jobRouter from "./routes/jobRouter.js";

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/", (req, res) => {
    res.send('POST request to the / endpoint');
})

app.use("/api/v1/jobs", jobRouter);

app.use("*", (req, res) => {
    res.status(404).json({ msg: "not found" });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ msg: "something went wrong" });
});

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