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
        message: "",
        email: ""
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
router.post('/api_key/confirmation', async (req, res, next) => {
    if (req.body.gdpr && req.body.gdpr == "gdpr") {
        try {
            const email = req.body.email;
            const apiKey = await apiKeyModel.newThirdParty(email);

            res.render("api_key/confirmation", {
                title: "API key confirmation",
                api_key: apiKey
            });
        } catch (error) {
            next(error);
        }
    }

    let data = {
        title: "Request API Key",
        api_key_url: "/v1/docs/api_key/confirmation",
        message: "Approve the terms and conditions.",
        email: req.body.email
    };

    res.render("api_key/form", data);
});

export default router;
