import express from "express";
import empModel from "../../src/models/emp.js";
import userModel from "../../src/models/user.js";

import adminRouter from "./admin/index.js";
import userRouter from "./user/index.js";
import bikesRouter from "./bikes.js";
import cardRouter from "./card.js";
import citiesRouter from "./cities.js";
import loginRouter from "./login.js";
import registerRouter from "./register.js";
import zonesRouter from "./zones.js";

const router = express.Router();

router.use("/admin", /** empModel.checkAdminAcc */ adminRouter);
router.use("/user", /** userModel.checkToken */ userRouter);
router.use("/bikes", bikesRouter);
router.use("/card", cardRouter);
router.use("/cities", citiesRouter);
router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/zones", zonesRouter);

export default router;
