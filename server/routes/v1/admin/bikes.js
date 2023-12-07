import express from "express";
import bikeModel from "../../../src/models/bike.js";
import clientManager from "../../../src/utils/clientManager.js";

const router = express.Router();

/**
 * @description Route for activating a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id/activate", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.id);

        const bikeData = await bikeModel.activate(bikeId);

        const data = {
            bike_id: bikeId,
            instruction: "unlock_bike"
        };

        clientManager.broadcastToBike(bikeId, data);

        res.status(200).json(bikeData);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for deactivating a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id/deactivate", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.id);

        const bikeData = await bikeModel.activate(bikeId);

        const data = {
            bike_id: bikeId,
            instruction: "lock_bike"
        };

        clientManager.broadcastToBike(bikeId, data);

        res.status(200).json(bikeData);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for changing a bike's status
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:bikeId/status/:statusId", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.bikeId);
        const statusId = parseInt(req.params.statusId);

        const bikeData = await bikeModel.updStatus(bikeId, statusId);

        const data = {
            bike_id: bikeId,
            instruction: "set_status",
            args: [statusId]
        };

        clientManager.broadcastToBike(bikeId, data);

        res.status(200).json(bikeData);
    } catch (error) {
        next(error);
    }
});

// /**
//  * @description Route for changing a bike's position
//  *
//  * @param {express.Request} req Request object
//  * @param {express.Response} res Response object
//  * @param {express.NextFunction} next Next function
//  *
//  * @returns {void}
//  */
// router.get("/:id/move", async (req, res, next) => {
//     // code here for changing a bike's position
// });

/**
 * @description Route for changing a bike's city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id/change/city", async (req, res, next) => {
    try {
        const bikeId = parseInt(req.params.id);
        const cityId = req.body.city_id;

        const bikeData = await bikeModel.updCity(bikeId, cityId);

        res.status(200).json(bikeData);
    } catch (error) {
        next(error);
    }
});

export default router;
