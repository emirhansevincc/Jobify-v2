import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";

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

const port = process.env.PORT || 5100;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
