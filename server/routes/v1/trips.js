import express from "express";
// import tripsModel from "../../models/trips.js";

const router = express.Router();

/**
 * @description Route for getting all trips
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    // code here for getting all trips through tripsModel
});

/**
 * @description Route for getting one trip
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    // code here for getting one trip through tripsModel
});

export default router;
