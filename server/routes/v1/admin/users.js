import express from "express";
import userModel from "../../../src/models/user.js";
import paymentModel from "../../../src/models/payment.js";

const router = express.Router();

/**
 * @description Route for getting all users
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const users = await userModel.all();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting a set of users using pagination
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/limit/:limit/offset/:offset", async (req, res, next) => {
    try {
        const limit = parseInt(req.params.limit);
        const offset = parseInt(req.params.offset);

        const users = await userModel.allPag(offset, limit);

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for searching for a user
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/search/:search", async (req, res, next) => {
    try {
        const searchParam = req.params.search;

        const users = await userModel.userSearch(searchParam)[0];

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting one user
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    try {
        const searchParam = parseInt(req.params.id);

        const users = await userModel.userSearch(searchParam)[0];

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for billing users with negative balance
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/invoice", async (req, res, next) => {
    try {
        const invoiceData = await paymentModel.invoice();

        res.status(200).json(invoiceData);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for updating a user's status
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id/status", async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const status = req.body.active;
        const userData = await userModel.updStatus(userId, status);

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for updating a user's email
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id/email", async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const email = req.body.email;
        const userData = await userModel.updEmail(userId, email);

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
});

export default router;
