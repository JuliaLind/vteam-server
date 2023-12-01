import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for getting user card info
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    // code here for getting user card info
});

/**
 * @description Route for updating user card info
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/", async (req, res, next) => {
    // code here for updating user card info
});

export default router;
