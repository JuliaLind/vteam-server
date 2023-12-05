import express from "express";
import bikeModel from "../../../src/models/bike.js";

const router = express.Router();

/**
 * @description Route for getting available bikes of a city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/bikes", async (req, res, next) => {
    try {
        const cityId = req.params.id;

        const bikes = await bikeModel.getAvail(cityId);

        res.status(200).json(bikes);
    } catch (error) {
        next(error);
    }
});

export default router;
