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
    // it('extracting deactivated employee with existing username', async () => {
    //     const emp = await empModel.getOneFromDb(username2)

    //     expect(emp).to.be.an('undefined');
    // });
    // it('extracting employee with nonexisting username', async () => {
    //     const emp = await empModel.getOneFromDb("doesnotexist")

    //     expect(emp).to.be.an('undefined');
    // });

    // it('checkToken with valid token', () => {
    //     const req = {
    //         headers: {
    //             "x-access-token": jwtToken
    //         },
    //         body: {}
    //     };
    //     const res = {};
    //     const next = sinon.spy(); // Spy on the next function
    
    //     // Call the route handler with the fake objects
    //     empModel.checkToken(req, res, next, ["admin"]);
    
    //     // Assertions using Sinon and Chai

    //     expect(req.body.emp).to.deep.equal(payload);
    //     expect(next.called).to.be.true;
    // });

    // it('checkToken with valid admin token', () => {
    //     const req = {
    //         headers: {
    //             "x-access-token": jwtToken
    //         },
    //         body: {}
    //     };
    //     const res = {};
    //     const next = sinon.spy(); // Spy on the next function
    
    //     // Call the route handler with the fake objects
    //     empModel.checkAdminAcc(req, res, next);
    
    //     // Assertions using Sinon and Chai

    //     expect(req.body.emp).to.deep.equal(payload);
    //     expect(next.called).to.be.true;
    // });

    // it('checkToken with expired token', () => {
    //     const req = {
    //         headers: {
    //             "x-access-token": expiredToken
    //         },
    //         body: {}
    //     };
    //     const res = {};
    //     res.status = sinon.stub().returnsThis();
    //     res.json = sinon.stub();
    //     const next = sinon.spy(); // Spy on the next function
    
    //     // Call the route handler with the fake objects
    //     empModel.checkToken(req, res, next, ["admin"]);
    
    //     // Assertions using Sinon and Chai

    //     expect(res.status.calledOnceWith(500)).to.be.true;
    //     expect(res.json.calledOnceWithExactly({
    //       errors: {
    //         status: 500,
    //         source: "authorization",
    //         title: "Failed authentication",
    //         detail: "jwt expired"
    //       },
    //     })).to.be.true;
    //     expect(next.called).to.be.false;
    // });

    // it('checkToken with missing token', () => {
    //     const req = {
    //         headers: {},
    //         body: {}
    //     };

    //     const res = {};
    //     res.status = sinon.stub().returnsThis();
    //     res.json = sinon.stub();

    //     const next = sinon.spy();
    //     empModel.checkToken(req, res, next, ["admin"]);
    

    //     expect(res.status.calledOnceWith(500)).to.be.true;
    //     expect(res.json.calledOnceWithExactly({
    //       errors: {
    //         status: 500,
    //         source: "authorization",
    //         title: "Failed authentication",
    //         detail: "jwt must be provided"
    //       },
    //     })).to.be.true;
    //     expect(next.called).to.be.false;
    // });

    // it('checkToken with valid token but wrong role', () => {
    //     const req = {
    //         headers: {
    //             "x-access-token": jwtToken
    //         },
    //         originalUrl: "someurl"
    //     };
    //     const res = {};
    //     res.status = sinon.stub().returnsThis();
    //     res.json = sinon.stub();
    //     const next = sinon.spy();

    //     empModel.checkToken(req, res, next, ["superadmin"]);
    //     expect(res.status.calledOnceWith(404)).to.be.true;
    //     expect(res.json.calledOnceWithExactly({
    //       errors: {
    //         status: 404,
    //         source: "someurl",
    //         title: "Not found",
    //         detail: "Page not found"
    //       },
    //     })).to.be.true;

    //     expect(next.called).to.be.false;
    // });

    // it('checkAdminAcc wrong role', () => {
    //     const payload = {
    //         id: 1,
    //         role: "service"
    //     };

    //     const wrongRoleToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    //     const req = {
    //         headers: {
    //             "x-access-token": wrongRoleToken
    //         },
    //         originalUrl: "someurl"
    //     };
    //     const res = {};
    //     res.status = sinon.stub().returnsThis();
    //     res.json = sinon.stub();
    //     const next = sinon.spy();

    //     empModel.checkAdminAcc(req, res, next);
    //     expect(res.status.calledOnceWith(404)).to.be.true;
    //     expect(res.json.calledOnceWithExactly({
    //       errors: {
    //         status: 404,
    //         source: "someurl",
    //         title: "Not found",
    //         detail: "Page not found"
    //       },
    //     })).to.be.true;

    //     expect(next.called).to.be.false;
    // });


    // Add test for:

    //1. get token from github
    // 2. register
});
