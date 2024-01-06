import express from "express";
import paymentModel from "../../../src/models/payment.js";

const router = express.Router();

/**
 * @description Route for handling payments to user bike account
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.post("/", async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const userId = req.body.user_id;

        const receipt = await paymentModel.prepay(userId, amount);

        res.status(200).json(receipt);
    } catch (error) {
        next(error);
    }
});

export default router;
