import express from "express";
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
        const bikeId = req.params.bikeId;
        const userId = req.body.userId;

        // const result = await bikeModel createTrip etc..
        // Hämta parseIntad tripId ur resultatet

        const data = {
            bike_id: bikeId,
            instruction: "unlock_bike"
        };

        clientManager.broadcastToBikes(data)

        res.status(200).json({
            // trip_id: tripId
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
router.post("/return/:tripId", async (req, res, next) => {
    try {
        const tripId = parseInt(req.params.tripId);
        const bikeId = req.body.bike_id;

        // const result = await bikeModel endTrip etc..

        const data = {
            bike_id: bikeId,
            instruction: "lock_bike"
        };

        clientManager.broadcastToBikes(data);

        res.status(200).json({
            trip_id: tripId
        });
    } catch (error) {
        next(error);
    }
});

export default router;
