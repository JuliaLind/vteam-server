import express from "express";
// import bikesModel from "../../models/bikes.js";

const router = express.Router();

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
    // code here for getting all bikes through bikesModel
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
    // code here for getting one bike through bikesModel
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
    // code here for getting bike instructions through bikesModel
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
    // code here for updating bike through bikesModel
});

/**
 * @description Route for renting a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/:id/rent", async (req, res, next) => {
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
router.post("/:id/return", async (req, res, next) => {
    // code here for returning a bike through bikesModel
});

export default router;