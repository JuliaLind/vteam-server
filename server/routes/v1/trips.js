import express from "express";
import tripModel from "../../src/models/trip.js";

const router = express.Router();

/**
 * @description Route for trips for one user
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/", async (req, res, next) => {
    try {
        const userId = req.body.user_id;

        const trips = await tripModel.userTrips(userId);

        res.status(200).json(trips);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for trips for one user using pagination
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/limit/:limit/offset/:offset", async (req, res, next) => {
    try {
        const userId = req.body.user_id;
        const limit = parseInt(req.params.limit);
        const offset = parseInt(req.params.offset);

        const trips = await tripModel.userTripsPag(userId, offset, limit);

        res.status(200).json(trips);
    } catch (error) {
        next(error);
    }
});

export default router;
