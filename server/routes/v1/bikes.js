import express from "express";
import clientManager from "../../src/utils/clientManager";
import bikeModel from "../../src/models/bike.js";

const router = express.Router();
// TODO: Glöm inte att lägga till en feed-route som klienterna kan koppla upp sig mot
// Antagligen i en egen fil.

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

        await bikeModel.updateBike(
            bikeId,
            bikeData.status_id,
            bikeData.charge_perc,
            bikeData.coords
        );

        // TODO: Fixa stream till klienter
        clientManager.broadcastToClients(bikeData);

        // TODO: Skicka annat än status 200?
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
    // code here for getting city zones for a bike
});

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

        clientManager.addBike(res);

        req.on("close", () => {
            clientManager.removeBike(res);
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for starting simulation
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/simulate", async (req, res, next) => {
    try {
        const data = {
            instruction_all: "run_simulation"
        };

        clientManager.broadcastToBikes(data);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
