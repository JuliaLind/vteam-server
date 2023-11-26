import express from "express";
// import adminAuthModel from "../../models/admin-auth.js";

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

export default router;