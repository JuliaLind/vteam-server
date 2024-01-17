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
        const userId = req.body.user_id;

        const tripData = await tripModel.start(userId, bikeId);

        const data = {
            bike_id: bikeId,
            instruction: "set_status",
            args: [2]
        };

        clientManager.broadcastToBikes(bikeId, data)

        res.status(200).json(tripData);
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
        const userId = req.body.user_id;

        const tripData = await tripModel.end(userId, tripId);
        const bikeId = tripData.bike_id

        const data = {
            bike_id: bikeId,
            instruction: "set_status",
            args: [1]
        };

        const data_2 = {
            bike_id: bikeId,
            instruction: "update_bike_data"
        }

        clientManager.broadcastToBikes(bikeId, data);
        clientManager.broadcastToBikes(bikeId, data_2);

        res.status(200).json(tripData);
    } catch (error) {
        next(error);
    }
});

export default router;
