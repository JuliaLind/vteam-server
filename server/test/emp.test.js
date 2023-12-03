/* global it describe */

//Require the dev-dependencies
import chai from 'chai';
// import chaiHttp from 'chai-http';
chai.should();
// chai.use(chaiHttp);
// import chaiJson from 'chai-json'
// chai.use(chaiJson);
const expect = chai.expect;
import { db } from "../src/models/db.js";
import empModel from "../src/models/emp.js";

// const jwt = require('jsonwebtoken');
// const jwtSecret = process.env.JWT_SECRET;
// const payload = {
//     email: "test@test.se"
// };
// const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
import bcrypt from 'bcryptjs';

// const sinon = require('sinon');


describe('emp model', async () => {
    const username = "testadmin";
    const username2 = "testadmi2n";
    const password = "test";
    const password2 = "test2";
    const hash = bcrypt.hashSync(password, 10);
    const hash2 = bcrypt.hashSync(password2, 10);
    before(async () => {
        let sql = `DELETE FROM employee;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO employee VALUES(?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?);`;
        let args = [
            1, username, hash, "admin", true,
            2, username2, hash2, "admin", false
        ];
        await conn.query(sql, args);
        if (conn) conn.end();
    });
    it('extracting active employee with existing username, should return employee object', async () => {
        const emp = await empModel.getOneFromDb(username)

        expect(emp).to.deep.equal({
            id: 1,
            username: "testadmin",
            hash: hash,
            role: "admin"
        });
    });
    it('extracting deactiveated employee with existing username', async () => {
        const emp = await empModel.getOneFromDb(username2)

        expect(emp).to.be.an('undefined');
    });
    it('extracting employee with nonexisting username', async () => {
        const emp = await empModel.getOneFromDb("doesnotexist")

        expect(emp).to.be.an('undefined');
    });
});
