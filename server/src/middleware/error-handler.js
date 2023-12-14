import express from "express";

/**
 *
 * @param {Error} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    if (process.env.NODE_ENV !== 'test') {
        console.error(err.stack);
    }

    const statusCode = 500;

    res.status(statusCode).json({
        errors: {
            message: err.message,
            code: statusCode
        }
    });
}

export default errorHandler;
