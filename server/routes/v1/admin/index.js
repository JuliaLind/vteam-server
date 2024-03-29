import express from "express";
import empModel from "../../../src/models/emp.js";

import bikesRouter from "./bikes.js";
import feedRouter from "./feed.js";
import simulationRouter from "./simulate.js";
import transactionsRouter from "./transactions.js";
import tripsRouter from "./trips.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/feed", feedRouter);

router.use("/", empModel.checkAdminAcc);

router.use("/bikes", bikesRouter);
router.use("/simulate", simulationRouter);
router.use("/transactions", transactionsRouter);
router.use("/trips", tripsRouter)
router.use("/users", usersRouter);

export default router;
