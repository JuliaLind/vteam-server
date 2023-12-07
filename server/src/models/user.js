import jwt from "jsonwebtoken";
import { db } from "./db.js";
import express from "express";

const jwtSecret = String(process.env.JWT_SECRET);

const user = {
    /**
     * Extracts id from token and adds to body as userId
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next
     */
    checkToken: function(req, res, next) {
        let token = req.headers["x-access-token"];

        /**
         * @typedef {Object} JwtPayload
         * @property {String} role
         * @property {String} id
         */
        jwt.verify(token, jwtSecret, function (err, /** @type {JwtPayload} */decoded) {
            // if no token has been provided,
            // or if provided token is expired
            // this block will be executed
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "authorization",
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            req.body.userId = decoded.id;

            return next();
        });
    },
    /**
     * Exchanges a github token for the
     * user's email
     * @param {String} githubToken 
     */
    extractEmail: async function(githubToken) {
        // add logic here for extracting user email from Github
        // await ....
    },
    /**
     * Inserts a new user into the
     * database (to be used in the register
     * method). Returns an object containing
     * the id and the email of the user
     * @param {String} email 
     * @param {String} cardnr 
     * @param {Number} cardtype 
     * @returns {Promise<Object>}
     */
    insertIntoDB: async function(email, cardnr, cardtype) {

        const result = await db.queryWithArgs(`CALL new_user(?, ?, ?);`, [email, cardnr, cardtype]);

        return result[0][0];
    },
    /**
     * Gets user details from db.
     * Returns an object containing the
     * users id and email (to be used in the
     * login method). Throws an error if
     * the user has been deactivated
     * @param {String} email 
     * @returns {Promise<Object>}
     */
    getFromDB: async function(email) {

        const result = await db.queryWithArgs(`CALL user_login(?);`, [email]);
        const user = result[0][0];
        if (user === undefined) {
            throw new Error("The user does not exist");
        }
        return user;

    },
    /**
     * Registers a new user
     * Body should contain Github Token,
     * Card nr as string and card type as int
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    register: async function(req, res, next) {
        const email = this.extractEmail(req.body.token)
        const payload = await this.newUser(email, req.body.cardnr, req.body.cardtype);
        const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
        return res.json({
            data: {
                type: "success",
                message: "User logged in",
                user: payload,
                token: jwtToken
            }
        });
    },
    /**
     * Body should contain Github Token.
     * Logins the user and returns a token.
     * The tokens payload contains the user's
     * id and email
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    login: async function(req, res, next) {
        const email = this.extractEmail(req.body.token)
        const payload = await this.getFromDB(email);
;
        const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

        return res.json({
            data: {
                type: "success",
                message: "User logged in",
                user: payload,
                token: jwtToken
            }
        });
    },
    /**
     * 
     * @param {String | Number} what id or email to search for, for wildcard search add % before, after or both
     * @return {Promise<Array>} if the search string is not a wildcard the array will only contain one object. Use this method so get data for single user, make sure to pick out the first elem from array
     */
    search: async function(what) {
        const result = await db.queryWithArgs(`CALL user_search(?);`, [what]);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * Updates the user's active-status.
     * Returns an updated user-object containing:
     * id, email, balance and active (bool)
     * @param {Number} userId 
     * @param {Boolean} active 
     * @returns {Promise<Object>}
     */
    updStatus: async function(userId, active) {
        const result = await db.queryWithArgs(`CALL upd_user_status(?, ?);`, [userId, active]);
        return this.adjTypes(result[0][0]);
    },
    /**
     * Updates the user's email. Returns an
     * updated user-object containing:
     * id, email, balance and active (bool)
     * @param {Number} userId
     * @param {String} email
     * @returns {Promise<Object>}
     */
    updEmail: async function(userId, email) {
        const result = await db.queryWithArgs(`CALL upd_user_email(?, ?);`, [userId, email]);
        return this.adjTypes(result[0][0]);
    },
    /**
     * 
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Promise<Array>}
     */
    allPag: async function(offset, limit) {
        const result = await db.queryWithArgs(`CALL all_users_pag(?, ?);`, [offset, limit]);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * 
     * @returns {Promise<Array>}
     */
    all: async function() {
        const result = await db.queryNoArgs(`CALL all_users();`);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * Database returns all attributes
     * as either integers or strings.
     * This function ensures that decimal
     * numbers are represented as floating point
     * and active is a boolean
     * @param {Object} userObj 
     * @returns {Object}
     */
    adjTypes(userObj) {
        userObj.balance = parseFloat(userObj.balance);
        userObj.active = userObj.active === 1;
        return userObj;
    },
};

export default user;
