import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import { nanoid } from "nanoid";

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
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
