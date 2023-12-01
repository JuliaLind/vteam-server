import express from "express";
// import some model from some file

const router = express.Router();

/**
 * @description Route for transactions for one user
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", (req, res, next) => {
    // code here for getting transactions for one user
    // Båda admin och användare använder den här routen
    // user_id finns antingen i token eller body (admin)
});

/**
 * @description Route for transactions for one user using pagination
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/limit/:limit/offset/:offset", (req, res, next) => {
    // code here for getting transactions for one user using pagination
    // Båda admin och användare använder den här routen
    // user_id finns antingen i token eller body (admin)
});

export default router;
