import express from "express";
// import zonesModel from "../../models/zones.js";

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
    // code here for getting all zones through zonesModel
});

/**
 * @description Route for getting one zone
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    // code here for getting one zone through zonesModel
});

export default router;
