import express from "express";
// import some model from some file

import adminRouter from "./admin/index.js";
import bikesRouter from "./bikes.js";
import cardRouter from "./card.js";
import citiesRouter from "./cities.js";
import loginRouter from "./login.js";
import registerRouter from "./register.js";
import userRouter from "./user/index.js";
import zonesRouter from "./zones.js";

const router = express.Router();

router.use("/admin", /** + authModel.checkToken ? */ adminRouter);
router.use("/bikes", bikesRouter);
router.use("/card", cardRouter);
router.use("/cities", citiesRouter);
router.use("login", loginRouter);
router.use("/register", registerRouter);
router.use("/user", userRouter);
router.use("zones", zonesRouter);

export default router;
