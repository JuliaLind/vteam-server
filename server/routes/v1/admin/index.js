import express from "express";

import bikesRouter from "./bikes.js";
import transactionsRouter from "../transactions.js";
import tripsRouter from "../trips.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/bikes", bikesRouter);
router.use("/transactions", transactionsRouter);
router.use("/trips", tripsRouter)
router.use("/users", usersRouter);


export default router;
