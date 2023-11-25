import express from "express";
// import adminAuthModel from "../../models/admin-auth.js";

const router = express.Router();

/**
 * @description Admin register route
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/register", async (req, res, next) => {
    // code here for registering an admin user through authModel
});

/**
 * @description Admin login route
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/admin", (req, res) => {
    // code here for logging in an admin user through authModel
});

export default router;