import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";


dotenv.config();
// dotenv.config({ path: '.env' });

import apiRouter from "./routes/v1/index.js";
import errorHandler from "./src/middleware/error-handler.js";
// import apiKeyHandler from "./src/middleware/apiKey-handler.js";


const app = express();

app.use(morgan("dev"));

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// TODO: Här kan vi lägga in en middleware för att kolla API-nyckel?
// app.use(apiKeyHandler);

app.use("/v1", apiRouter);

app.use(errorHandler);


/**
 * Just to check that database connection
 * is working.. will remove later
 */
app.get("/", async (req, res) => {
    res.json({
        data: "Hej från team2 server",
    });
});

export default app;
