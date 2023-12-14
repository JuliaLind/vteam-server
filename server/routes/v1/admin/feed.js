import express from "express";
import clientManager from "../../../src/utils/clientManager.js";

const router = express.Router();

/**
 * @description Route for connecting to sse for receiving bike data
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    try {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        clientManager.addClient(res);

        req.on("close", () => {
            clientManager.removeClient(res);
        });
    } catch (error) {
        next(error);
    }
});

export default router;
