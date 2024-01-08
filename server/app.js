import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import apiRouter from "./routes/v1/index.js";
import errorHandler from "./src/middleware/error-handler.js";

const corsOptions = {
    origin: true,
    credentials: true
};

dotenv.config();
// dotenv.config({ path: '.env' });

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(morgan("dev"));

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/v1", apiRouter);

app.use(errorHandler);

export default app;
