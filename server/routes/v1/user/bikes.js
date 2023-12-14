import express from "express";
import tripModel from "../../../src/models/trip.js";
import clientManager from "../../../src/utils/clientManager.js";

const router = express.Router();

/**
 * @description Route for renting a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/rent/:bikeId", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.bikeId);
        const userId = req.body.userId;

        const trip = await tripModel.start(userId, bikeId);
        const tripId = trip.id;

        const data = {
            bike_id: bikeId,
            instruction: "set_status",
            args: [2]
        };

        clientManager.broadcastToBikes(bikeId, data)

        res.status(200).json({
            trip_id: tripId
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for returning a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/return/:tripId", async (req, res, next) => {
    try {
        const tripId = parseInt(req.params.tripId);
        const userId = req.body.userId;

        const trip = await tripModel.end(userId, tripId);
        const bikeId = trip.bike_id;

        const data = {
            bike_id: bikeId,
            instruction: "set_status",
            args: [1]
        };

        clientManager.broadcastToBikes(bikeId, data);

        res.status(200).json({
            trip_id: tripId
        });
    } catch (error) {
        next(error);
    }
});

export default router;
