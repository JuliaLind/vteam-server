import express from "express";
// import some model from some file

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
        const userId = req.body.userId;

        // TODO: Importera modell och anropa modellens payment-metod.
    } catch (error) {
        
    }
});

export default router;
