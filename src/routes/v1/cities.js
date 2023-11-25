import express from "express";
// import citiesModel from "../../models/cities.js";

const router = express.Router();

/**
 * Note to self:
 * Wrappa hämtningarna i en try catch där catch pekar
 * mot felhanterings-middleware med hjälp av next
 * Tänk på payload/token
 */

/**
 * @description Route for getting all cities
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", (req, res, next) => {
    // code here for getting all cities through citiesModel
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
router.get("/:id", (req, res, next) => {
    // code here for getting one city through citiesModel
});

export default router;