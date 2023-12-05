import express from "express";
import cardModel from "../../src/models/card.js";

const router = express.Router();

/**
 * @description Route for getting all charge card types
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/types", async (req, res, next) => {
    try {
        const cardTypes = await cardModel.getTypes();

        res.status(200).json(cardTypes);
    } catch (error) {
        next(error);
    }
});

export default router;
