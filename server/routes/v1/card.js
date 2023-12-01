import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for getting all charge card types
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/types", async (req, res, next) => {
    // code here for getting all charge card types
});

export default router;
