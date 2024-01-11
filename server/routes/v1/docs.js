import express from "express";
import routesInfo from "../../src/utils/routesInfo.js";
import apiKeyModel from "../../src/models/api-key.js";

const router = express.Router();

/**
 * @description Route for displaying API documentation
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, next) => {
    res.render("documentation/layout", {
        title: "API Documentation",
        routesInfo: routesInfo
    });
});

/**
 * @description Route for displaying form for creating a new API key
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
router.get('/api_key', (req, res, next) => {
    res.render("api_key/form", {
        title: "Request API Key",
        api_key_url: "/v1/docs/api_key/confirmation",
        email: req.query.email,
        message: req.query.message
    });
});

/**
 * @description Route for displaying form for creating a new API key
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
router.post('/api_key/confirmation', async (req, res, next) => {
    const email = req.body.email;

    if (req.body.gdpr === undefined || req.body.gdpr !== "gdpr") {
        res.redirect(
            `/v1/docs/api_key?message=${encodeURIComponent('You must approve terms and conditions.')}&email=${email}`
        );
        return;
    }

    try {
        const apiKey = await apiKeyModel.newThirdParty(email);

        res.render("api_key/confirmation", {
            title: "API key confirmation",
            api_key: apiKey.key
        });
    } catch (error) {
        res.redirect(error.sqlMessage.includes("already registered")
            ? `/v1/docs/api_key?message=${encodeURIComponent('Can not register email. Try another one.')}`
            : "back"
        );
    }
});

export default router;
