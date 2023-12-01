import express from "express";
// import some model from some file
// TODO: räcker det med auth-modell som har metoder för att
// verifiera både en admin och en användare?
// i så fall import authModel from "../../models/auth.js"

const router = express.Router();

/**
 * @description Admin login route
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/admin", async (req, res) => {
    // code here for logging in an admin user through authModel
});

/**
 * @description User login route
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/user", async (req, res) => {
    // code here for logging in a user through authModel
});

export default router;