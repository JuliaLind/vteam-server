import express from "express";
import empModel from "../../src/models/emp.js";

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
router.post("/admin", async (req, res, next) => {
    await empModel.login(req, res);
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