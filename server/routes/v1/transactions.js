import express from "express";
import paymentModel from "../../src/models/payment.js";

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
router.post("/", async (req, res, next) => {
    try {
        const userId = req.body.user_id;

        const transactions = await paymentModel.userPayments(userId);

        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
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
router.post("/limit/:limit/offset/:offset", async (req, res, next) => {
    try {
        const userId = req.body.user_id;
        const limit = parseInt(req.params.limit);
        const offset = parseInt(req.params.offset);

        const transactions = await paymentModel.userPaymentsPag(userId, offset, limit);

        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
});

export default router;
