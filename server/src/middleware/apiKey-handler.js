// eslint-disable-next-line no-unused-vars
import express from "express";
import apiKeyModel from "../models/api-key.js";

/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function apiKeyHandler(req, res, next) {

    const apiKey = req.headers['x-api-key'];

    const apiKeyString = Array.isArray(apiKey) ? apiKey[0] : apiKey;

    if (!apiKeyString) {
        return res.status(401).json({
            success: false,
            message: 'API key is required.'
        });
    }

    const isValidKey = await apiKeyModel.checkOne(apiKeyString);

    if (!isValidKey) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or missing API key. Access denied.'
        });
    }

    return next();
}

export default apiKeyHandler;
