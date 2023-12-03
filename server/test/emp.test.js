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


describe('admin-related', async () => {
    const username = "testadmin";
    const password = "test";
    const hash = bcrypt.hashSync(password, 10);
    before(async () => {
        let sql = `DELETE FROM employee;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO employee VALUES(?, ?, ?, ?, ?);`;
        let args = [1, username, hash, "admin", true];
        await conn.query(sql, args);
        if (conn) conn.end();
    });
    it('should return an employee', async () => {
        const emp = await empModel.getOneFromDb(username)

        expect(emp).to.deep.equal({
            id: 1,
            username: "testadmin",
            hash: hash,
            role: "admin"
        });
    });
});
