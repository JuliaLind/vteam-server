import express from "express";
// import authModel from "../../models/admin-auth.js"

const router = express.Router();

import adminRouter from './admin.js';
import bikesRouter from './bikes.js';
// import citiesRouter from "./cities.js";
// import loginRouter from "./login.js";
// import tripsRouter from "./trips.js";
// import usersRouter from "./users.js";
// import zonesRouter from "./zones.js";

router.use("/admin", /** + authModel.checkToken ? */ adminRouter);
router.use("/bikes", bikesRouter)
// router.use("/cities", citiesRouter);
// router.use("/login", loginRouter);
// router.use("/trips", tripsRouter);
// router.use("/users", usersRouter);
// router.use("/zones", zonesRouter);


export default router;

