import express from "express";
import userModel from "../../../src/models/user.js";

import bikesRouter from "./bikes.js";
import cardRouter from "./card.js";
import citiesRouter from "./cities.js";
import paymentRouter from "./payment.js";
import transactionsRouter from "../transactions.js";
import tripsRouter from "../trips.js";

const router = express.Router();

router.use("/", userModel.checkToken);

router.use("/bikes", bikesRouter);
router.use("/card", cardRouter);
router.use("/cities", citiesRouter);
router.use("/payment", paymentRouter);
router.use("/transactions", transactionsRouter);
router.use("/trips", tripsRouter);

export default router;
