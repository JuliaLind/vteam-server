import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js"
import express from "express";


const jwtSecret = String(process.env.JWT_SECRET);

// separata modeller för emp och user eftersom
// inloggningen och registereringen fungerar annorlunda
// och checkToken funktionen kommer också skilja sig,
// dels ingen check för roll och dets lyfta ut idt och lägga till på req.body
const emp = {
    getOneFromDb: async function(username) {
        const result = await db.queryWithArgs(`CALL emp_login(?);`, [username]);
        return result[0][0];
    },
    checkAdminAcc: function(req, res, next) {
        this.checkToken(req, res, next, ["admin"]);
    },
    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * @param {Array} acceptableRoles array with acceptable roles, for example ["admin"] or ["admin", "superadmin"]
     */
    checkToken: function(req, res, next, acceptableRoles) {
        let token = String(req.headers["x-access-token"]);

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

            // kallar den för emp för att skilja från user attributet som kan vara med i vissa förfrågningar
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
     * @param {express.NextFunction} next Next function
     *
     * @returns {Promise<Object>} JSON object
     */
    login: async function login(req, res, next) {
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