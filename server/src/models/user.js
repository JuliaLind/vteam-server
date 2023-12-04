import jwt from "jsonwebtoken";
import { db } from "./db.js";
import express from "express";

const jwtSecret = String(process.env.JWT_SECRET);

const user = {
    extractEmail: async function(githubToken) {
        // add logic here for extracting user email from Github
        // await ....
    },
    insertIntoDB: async function(email, cardnr, cardtype) {

        const result = await db.queryWithArgs(`CALL new_user(?, ?, ?);`, [email, cardnr, cardtype]);

        return result[0][0];

    },
    /**
     * body should contain Github Token,
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
     * body should contain Github Token
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    login: async function(req, res, next) {
        const email = this.extractEmail(req.body.token)
        const payload = await db.queryWithArgs(`CALL user_login(?);`, [email]);
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
     * @param {String | Number} what id or email to search for, for wilcard search add % before, after or both
     * @return {Promise<Array>} if the search string is not a wildcard the array will only contain one object
     */
    userSearch: async function(what) {
        const result = await db.queryWithArgs(`CALL user_search(?);`, [what]);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * 
     * @param {Number} userId 
     * @param {Boolean} active 
     * @returns {Promise<Object>}
     */
    updStatus: async function(userId, active) {
        const result = await db.queryWithArgs(`CALL upd_user_status(?, ?);`, [userId, active]);
        return this.adjTypes(result[0][0]);
    },
    /**
     * 
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
        const result = await db.queryWithArgs(`CALL upd_user_email(?, ?);`, [offset, limit]);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * Behöver ses över.
     */
    all: async function() {
        const result = await db.queryNoArgs(`CALL all_users_pag();`, [offset, limit]);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    /**
     * JSDoc-kommentar?
     */
    adjTypes(userObj) {
        userObj.balance = parseFloat(userObj.balance);
        userObj.active = userObj.active === 1;
        return userObj;
    },
};

export default user;
