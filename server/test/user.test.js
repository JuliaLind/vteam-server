/* global it describe */

import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import userModel from "../src/models/user.js";

import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;


describe('user model', () => {

    // // ok token
    // const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    // // expired token
    // const expiredPayload = {
    //     ...payload,
    //     iat: Math.floor(Date.now() / 1000) - 3600,
    //     exp: Math.floor(Date.now() / 1000) - 1800
    // };
    // const expiredToken = jwt.sign(expiredPayload, jwtSecret);
    const users = [
        {
            id: 4,
            email: "jdoniso4@alibaba.com",
            card: "5362 1630 1011 0910",
            card_type: 2,
            balance: 261.93,
            active: true,
        },
        {
            id: 5,
            email: "bcroft7@qq.com",
            card: "4508 1325 6002 5300",
            card_type: 1,
            balance: -372.87,
            active: false,
        },
        {
            id: 6,
            email: "afolonind@statcounter.com",
            card: "4844 9104 5482 3920",
            card_type: 3,
            balance: "-128.53",
            active: true,
        }
    ];
    beforeEach(async () => {
        let sql = `DELETE FROM user;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`
        let args = [
            users[0].id, users[0].email, users[0].card, users[0].card_type, users[0].balance, users[0].active,
            users[1].id, users[1].email, users[1].card, users[1].card_type, users[1].balance, users[1].active,
            users[2].id, users[2].email, users[2].card, users[2].card_type, users[2].balance, users[2].active,

        ];
        await conn.query(sql, args);
        if (conn) conn.end();
    });
    afterEach(() => {
        sinon.restore();
    });
    it('registers new user in database', async () => {
        let user = await userModel.insertIntoDB(
            "testuser@email.com",
            "1234 5678 9123 4567",
            3
        )

        expect(Object.keys(user).length).to.equal(2);
        expect(user.email).to.equal("testuser@email.com");
        expect(user.id).to.be.a('number');

        const searchRes = await userModel.userSearch("testuser@email.com");
        user = searchRes[0];
        expect(Object.keys(user).length).to.equal(4);
        expect(user.email).to.equal("testuser@email.com");
        expect(user.id).to.be.a('number');
        expect(user.balance).to.equal(0.00);
        expect(user.active).to.be.true;
    });

    // Add test for:

    //1. get token from github
    // 2. register
    // 3. login
    // 4. Update user status
    // 5. Update user email
    // 6. All users
    // 7. Users paginated
});
