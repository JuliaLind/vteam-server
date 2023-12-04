import express from "express";

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
router.post("/rent/bikeId", async (req, res, next) => {
    // code here for renting a bike through bikesModel
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
    // code here for returning a bike through bikesModel
});

export default router;
