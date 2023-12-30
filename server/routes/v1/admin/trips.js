import express from "express";
import tripModel from "../../../src/models/trip.js";
import tripsRouter from "../trips.js";

const router = express.Router();

router.use("/", tripsRouter);

/**
 * @description Route for trips all trips in system
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/all", async (req, res, next) => {
    try {
        const trips = await tripModel.allTrips();

        res.status(200).json(trips);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for trips all trips in system paginated
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/all/limit/:limit/offset/:offset", async (req, res, next) => {
    try {
        const offset = parseInt(req.params.offset)
        const limit = parseInt(req.params.limit)
        const trips = await tripModel.allTripsPag(offset, limit);

        res.status(200).json(trips);
    } catch (error) {
        next(error);
    }
});


export default router;
