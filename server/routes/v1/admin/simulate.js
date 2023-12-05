import express from "express";
import clientManager from "../../../src/utils/clientManager";

const router = express.Router();

/**
 * @description Route for starting simulation
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        const data = {
            instruction_all: "run_simulation"
        };

        clientManager.broadcastToBikes(data);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export default router;
