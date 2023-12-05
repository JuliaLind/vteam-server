import express from "express";
import cityModel from "../../src/models/city.js";
import bikeModel from "../../src/models/bike.js";

const router = express.Router();

/**
 * @description Route for getting all cities
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const cities = await cityModel.all();

        res.status(200).json(cities);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting one city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    try {
        const cityId = req.params.id;

        const city = await cityModel.single(cityId);

        res.status(200).json(city);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting all bikes of a city
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

        const cityBikes = await bikeModel.getAllInCity(cityId);

        res.status(200).json(cityBikes);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting all zones of a city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/zones", async (req, res, next) => {
    try {
        const cityId = req.params.id;

        const cityZones = await cityModel.zonesInCity(cityId);

        res.status(200).json(cityZones);
    } catch (error) {
        next(error);
    }
});

export default router;
