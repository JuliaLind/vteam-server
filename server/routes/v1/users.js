import express from "express";
// import usersModel from "../../models/users.js";

const router = express.Router();

/**
 * @description Route for getting all users
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/", async (req, res, next) => {
    // code here for getting all users through usersModel
});

/**
 * @description Route for getting one user
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.get("/:id", async (req, res, next) => {
    // code here for getting one user through usersModel
});

/**
 * @description Route for updating a user
 *
 * @param {express.Request} req Request object
 * @param {express.Response} res Response object
 * @param {express.NextFunction} next Next function
 *
 * @returns {void}
 */
router.put("/:id", async (req, res, next) => {
    // code here for updating a user through usersModel
});

export default router;
