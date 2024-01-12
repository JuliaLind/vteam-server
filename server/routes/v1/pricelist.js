import express from "express";
import tripModel from "../../src/models/trip.js";

const router = express.Router();

/**
 * @description Route for getting pricelist
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const prices = await tripModel.pricelist();

        res.status(200).json(prices);
    } catch (error) {
        next(error);
    }
});

export default router;
