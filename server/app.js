import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
// import errorHandler from "./middleware/errors.js";
// import apiRouter from "./routes/v1/index.js";

dotenv.config();

const app = express();
const port = 1337;

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Här kan vi lägga in en middleware för att kolla API-nyckel?

// app.use("/v1", apiRouter);

// app.use(errorHandler);


/**
 * Shows all available routes
 */
app.get("/", (req, res) => {
    res.json({
        data: "Hej från team2 server"
    });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
