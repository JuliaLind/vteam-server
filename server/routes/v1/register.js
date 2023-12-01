import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description User register route
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/", async (req, res, next) => {
    // code here for registering a user
});

export default router;
