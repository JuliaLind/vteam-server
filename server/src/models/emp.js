import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js"

import dotenv from "dotenv";
dotenv.config();

import express from "express";


const jwtSecret = String(process.env.JWT_SECRET);

const emp = {
    /**
     * Returns id, username,
     * password-hash and role.
     * Will not return anything if
     * the admin's account has been
     * deactivated
     * @param {String} username 
     * @returns {Promise<Object>}
     */
    getOneFromDb: async function(username) {
        const result = await db.queryWithArgs(`CALL emp_login(?);`, [username]);
        return result[0][0];
    },
    /**
     * Checks if a token is valid
     * and if it's payload contains
     * role attribute with value
     * "admin"
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     */
    checkAdminAcc: function(req, res, next) {
        this.checkToken(req, res, next, ["admin"]);
    },
    /**
     * Checks if a token is valid
     * and if it's payload contains
     * role attribute with a value
     * that is included in the array
     * of acceptable rows
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * @param {Array} acceptableRoles array with acceptable roles, for example ["admin"] or ["admin", "superadmin"]
     */
    checkToken: function(req, res, next, acceptableRoles) {
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

            if (!acceptableRoles.includes(decoded.role)) {
                // if unauthorized request it is safer
                // to make it look like the page does not
                // exist
                return res.status(404).json({
                    errors: {
                        status: 404,
                        source: req.originalUrl,
                        title: "Not found",
                        detail: "Page not found"
                    }
                });
            }
            /**
             * OBS! osäker på om vi
             * behöver lägga till
             * dessa detaljer i bodyn,
             * jag tror inte att
             * det kommer behövas någonstans? 
             * Har admin  passerat denna route
             * så är det redan säkerställt att man har behörighet
             */
            req.body.emp = {
                id: decoded.id,
                role: decoded.role
            };

            return next();
        });
    },

    /**
     * @description Function that handles admin login
     *
     * @param {express.Request} req Request object
     * @param {express.Response} res Response object
     *
     * @returns {Promise<Object>} JSON object
     */
    login: async function login(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        const emp = await this.getOneFromDB(username);

        // om användarnamn saknas kommer
        // databasen lyfta ett error
        // om lösenord saknas kommer det fångas i bcrypt compare

        return this.comparePasswords(res, password, emp);
    },
    /**
     * @description Function that compares passwords
     *
     * @param {express.Response} res Response object
     * @param {String} password Password
     * @param {Object} emp User
     *
     * @returns {Object} JSON object
     */
    comparePasswords: function comparePasswords(res, password, emp) {
        bcrypt.compare(password, emp.hash, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                const payload = {
                    id: emp.id,
                    role: emp.role 
                };
                const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    }
};

export default emp;