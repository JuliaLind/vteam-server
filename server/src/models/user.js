import jwt from "jsonwebtoken";
import { db } from "./db.js";
import express from "express";

const jwtSecret = String(process.env.JWT_SECRET);

const user = {
    /**
     * Uses github access token to get user's email info
     * @param {String} githubToken 
     * @returns {Promise<String>} user's email
     */
    extractEmail: async function(githubToken) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${githubToken}` }
        });

        // the email data contains the user's emailaddressess and whether they are verified etc.
        const emailData = await emailResponse.json();

        return emailData.find((email) => email.primary === true).email
    },
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
                return res.status(401).json({
                    errors: {
                        status: 401,
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
     * Inserts a new user into the
     * database (to be used in the register
     * method). Returns an object containing
     * the id and the email of the user
     * @param {String} email 
     * @returns {Promise<Object>}
     */
    db: async function(email) {

        const result = await db.queryWithArgs(`CALL user_login(?);`, [email]);

        return result[0][0];
    },
    // },
    /**
     * Logs in user. If user does not have
     * an account, registers the user
     * Body should contain Github Token,
     * Card nr as string and card type as int
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    login: async function(req, res, next) {
        const email = this.extractEmail(req.body.token)
        let payload;
        try {
            payload = await this.db(email);
        } catch (err) {
            return next(err);
        }

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
     * Returns an array with all users.
     * Each user-object contains:
     * id, email, balance and active attribute (bool)
     * @returns {Promise<Array>}
     */
    all: async function() {
        const result = await db.queryNoArgs(`CALL all_users();`);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * Returns all users in an interval.
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
