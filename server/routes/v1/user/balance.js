import express from "express";
import userModel from "../../../src/models/user.js";

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
        const userId = req.body.user_id;

        const userData = await userModel.search(userId);

        const userBalance = userData[0].balance;

        res.status(200).json({
            balance: userBalance
        });
    } catch (error) {
        next(error);
    }
});

export default router;
