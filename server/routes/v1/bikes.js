import express from "express";
import clientManager from "../../src/utils/clientManager.js";
import bikeModel from "../../src/models/bike.js";
import cityModel from "../../src/models/city.js";

const router = express.Router();

/**
 * @description Route for getting bike instructions
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/instructions", async (req, res, next) => {
    try {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let bikeId = parseInt(String(req.headers["bike_id"]));

        // TODO: kom på ett bättre sätt att lösa det här på.
        if (isNaN(bikeId)) {
            return res.status(400).json({ error: "Invalid bike ID" });
        }

        clientManager.addBike(bikeId, res);

        res.on('close', () => {
            clientManager.removeBike(bikeId);

            res.end();
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/**
 * @description Route for getting all statuses a bike can have
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/status", async (req, res, next) => {
    try {
        const statuses = await bikeModel.statuses();

        res.status(200).json(statuses);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting all bikes
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const bikes = await bikeModel.getAll();

        res.status(200).json(bikes);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting one bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.id);
        const bike = await bikeModel.getOne(bikeId);

        res.status(200).json(bike);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for updating a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.id);
        const bikeData = req.body;

        const check = await bikeModel.updateBike(
            bikeId,
            bikeData.status_id,
            bikeData.charge_perc,
            bikeData.coords,
            req.headers['x-api-key']
        );

        if (check !== undefined) {
            const data = {
                bike_id: bikeId,
                instruction: "lock_bike"
            };
    
            clientManager.broadcastToBikes(bikeId, data);
        }

        clientManager.broadcastToClients(bikeData);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting city zones for a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/zones", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.id);

        const bikeZones = await cityModel.bikeZones(bikeId);

        res.status(200).json(bikeZones);
    } catch (error) {
        next(error);
    }
});

export default router;
