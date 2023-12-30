import express from "express";
import paymentModel from "../../../src/models/payment.js";
import transactionsRouter from "../transactions.js";

const router = express.Router();

router.use("/", transactionsRouter);

/**
 * @description Route for getting all transactions in system
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/all", async (req, res, next) => {
    try {
        const transactions = await paymentModel.allPayments();

        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for getting all transactions in system paginated
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/all/limit/:limit/offset/:offset", async (req, res, next) => {
    try {
        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);
        const transactions = await paymentModel.allPaymentsPag(offset, limit);

        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
});

export default router;
