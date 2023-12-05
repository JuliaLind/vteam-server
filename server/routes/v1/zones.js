import express from "express";
import cityModel from "../../src/models/city.js";

const router = express.Router();

/**
 * @description Route for getting all zones
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const zones = await cityModel.allZones();

        res.status(200).json(zones);
    } catch (error) {
        next(error);
    }
});

export default router;
