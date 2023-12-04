import express from "express";
// import some model from some file

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
 * @description Route for getting all statuses a bike can have
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/status", async (req, res, next) => {
    // code here for getting all statuses a bike can have
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
    // code here for getting bike instructions through bikesModel
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
    // code here for starting simulation
});

export default router;
