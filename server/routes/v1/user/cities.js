import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for getting available bikes of a city
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id/bikes", async (req, res, next) => {
    // code here for getting available bikes of a city
});

export default router;
