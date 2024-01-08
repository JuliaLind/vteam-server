import express from "express";

import adminRouter from "./admin/index.js";
import userRouter from "./user/index.js";
import bikesRouter from "./bikes.js";
import cardRouter from "./card.js";
import citiesRouter from "./cities.js";
import loginRouter from "./login.js";
import zonesRouter from "./zones.js";
import docsRouter from "./docs.js";
import apiKeyHandler from "../../src/middleware/apiKey-handler.js";

const router = express.Router();

router.use("/docs", docsRouter);

router.use(apiKeyHandler);

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/bikes", bikesRouter);
router.use("/card", cardRouter);
router.use("/cities", citiesRouter);
router.use("/login", loginRouter);
router.use("/zones", zonesRouter);

export default router;
