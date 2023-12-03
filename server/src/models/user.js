import jwt from "jsonwebtoken";
import { db } from "./db.js"

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
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    register: async function(req, res, next) {
        const email = this.extractEmail(req.body.token)
        const payload = await this.newUser(email, req.body.cardnr, req.body.cardtype);
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
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
     * @param {String | Int} what id or email to search for, for wilcard search add % before, after or both
     * @return {Array} if the search string is not a wildcard the array will only contain one object
     */
    userSearch: async function(what) {
        const result = await db.queryWithArgs(`CALL user_search(?);`, [what]);
        return result[0].map((user) => {
            return this.adjTypes(user);
        });
    },
    adjTypes(userObj) {
        userObj.balance = parseFloat(userObj.balance);
        userObj.active = userObj.active === 1;
        return userObj;
    },
};

export default user;
