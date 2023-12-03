import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js"


// separata modeller för emp och user eftersom
// inloggningen och registereringen fungerar annorlunda
// och checkToken funktionen kommer också skilja sig,
// dels ingen check för roll och dets lyfta ut idt och lägga till på req.body
const emp = {
    getOneFromDb: async function(username) {
        const result = await db.queryWithArgs(`CALL emp_login(?);`, [username]);
        const emp = result[0][0];
        return result[0][0];
    },
    checkToken: function(req, res, next, acceptableRoles=["admin"]) {
        let token = req.headers["x-access-token"];

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            // om inget token är med kommer det att kastas
            // ett fel här eftersom decoded inte kommer ha attributet role som alla token
            // som tillhör anställda ska ha
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

            req.emp = {
                id: decoded.id,
                role: decoded.role
            };

            console.log(req.emp);
            return next();
        });
    },

    /**
     * @description Function that handles admin login
     *
     * @param {Request} req Request object
     * @param {Response} res Response object
     * @param {Function} next Next function
     *
     * @returns {Object} JSON object
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
     * @param {Request} req Request object
     * @param {String} password Password
     * @param {Object} user User
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
                const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

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