import express from "express";
import cardModel from "../../../src/models/card.js";

const router = express.Router();

/**
 * @description Route for getting user card info
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const userId = req.body.user_id;
        const userData = await cardModel.userDetails(userId);

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
});

/**
 * @description Route for updating user card info
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/", async (req, res, next) => {
    try {
        const userId = req.body.user_id;
        const cardNr = req.body.card_nr;
        const cardType = req.body.card_type;

        const userData = await cardModel.updUserDetails(userId, cardNr, cardType);

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
});

export default router;
