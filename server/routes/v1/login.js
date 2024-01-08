import express from "express";
import empModel from "../../src/models/emp.js";
import userModel from "../../src/models/user.js";

const router = express.Router();

/**
 * @description Admin login route
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} _ Next function
 *
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
router.post("/admin", async (req, res, _) => {
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
router.post("/user", async (req, res, next) => {
    await userModel.login(req, res, next);
});

export default router;
