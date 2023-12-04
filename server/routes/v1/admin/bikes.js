import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for deactivating a bike
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/deactivate", (req, res, next) => {
    // code here for deactivating bike
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
router.get("/:bikeId/status/:statusId", (req, res, next) => {
    // code here for changing a bike's status
});

/**
 * @description Route for changing a bike's position
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/move", (req, res, next) => {
    // code here for changing a bike's position
});

/**
 * @description Route for changing a bike's city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/change/city", (req, res, next) => {
    // code here for changing a bike's city
});

export default router;
