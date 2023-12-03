/* global it describe */

//Require the dev-dependencies
import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import empModel from "../src/models/emp.js";

import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;

import bcrypt from 'bcryptjs';




describe('emp model', async () => {
    const username = "testadmin";
    const username2 = "testadmi2n";
    const password = "test";
    const password2 = "test2";
    const hash = bcrypt.hashSync(password, 10);
    const hash2 = bcrypt.hashSync(password2, 10);
    const payload = {
        id: 1,
        role: "admin"
    };

    // ok token
    const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    // expired token
    const expiredPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) - 1800
    };
    const expiredToken = jwt.sign(expiredPayload, jwtSecret);
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

    it('checkToken with valid token', async () => {
        const req = {
            headers: {
                "x-access-token": jwtToken
            },
            body: {}
        };
        const res = {};
        const next = sinon.spy(); // Spy on the next function
    
        // Call the route handler with the fake objects
        empModel.checkToken(req, res, next);
    
        // Assertions using Sinon and Chai

        expect(req.body.emp).to.deep.equal(payload);
        expect(next.called).to.be.true;
    });

    it('checkToken with expired token', async () => {
        const req = {
            headers: {
                "x-access-token": expiredToken
            },
            body: {}
        };
        const res = {
            status: sinon.stub().returnsThis(), // Stub status method
            json: sinon.stub(), // Stub json method
          };
        const next = sinon.spy(); // Spy on the next function
    
        // Call the route handler with the fake objects
        empModel.checkToken(req, res, next);
    
        // Assertions using Sinon and Chai

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithExactly({
          errors: {
            status: 500,
            source: "authorization",
            title: "Failed authentication",
            detail: "jwt expired"
          },
        })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('checkToken with missing token', async () => {
        const req = {
            headers: {},
            body: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        const next = sinon.spy();
        empModel.checkToken(req, res, next);
    

        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWithExactly({
          errors: {
            status: 500,
            source: "authorization",
            title: "Failed authentication",
            detail: "jwt must be provided"
          },
        })).to.be.true;
        expect(next.called).to.be.false;
    });

    it('checkToken with valid token but wrong role', async () => {
        const req = {
            headers: {
                "x-access-token": jwtToken
            },
            originalUrl: "someurl"
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        const next = sinon.spy();

        empModel.checkToken(req, res, next, ["superadmin"]);
        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWithExactly({
          errors: {
            status: 404,
            source: "someurl",
            title: "Not found",
            detail: "Page not found"
          },
        })).to.be.true;

        expect(next.called).to.be.false;
    });
});
