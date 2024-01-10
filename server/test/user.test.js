/* global it describe beforeEach afterEach */

import chai from 'chai';
import sinon from 'sinon';
chai.should();

import { db } from "../src/models/db.js";
import userModel from "../src/models/user.js";
import { users } from './dummy-data/users.js';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
const expect = chai.expect;

import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;


describe('user model', () => {

    // ok token
    const payload = {
        id: users[0].id,
        email: users[0].email
    }
    const okToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    // expired token
    const expiredPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) - 1800
    };
    const expiredToken = jwt.sign(expiredPayload, jwtSecret);
    beforeEach(async () => {
        const conn = await db.pool.getConnection();

        let sql = `DELETE FROM user;
        INSERT INTO user VALUES(?, ?, ?, ?),
            (?, ?, ?, ?),
            (?, ?, ?, ?),
            (?, ?, ?, ?);`;

        let args = [];

        for (const user of users) {
            args = args.concat([user.id, user.email, user.balance, user.active]);
        }
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    afterEach(() => {
        sinon.restore();
    });
    it('checkToken, expire token, not ok', () => {
        const req = {
            headers: {
                "x-access-token": expiredToken,
            },
            body: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.spy();

        userModel.checkToken(req, res, next);

        expect(res.status).to.have.been.calledOnceWith(401);
        expect(res.json).to.have.been.calledOnceWith({
            errors: {
                status: 401,
                source: 'authorization',
                title: 'Failed authentication',
                detail: 'jwt expired'
            }
        });


        expect(next.notCalled).to.be.true;
    });
    it('checkToken, ok', () => {
        const req = {
            headers: {
                "x-access-token": okToken,
            },
            body: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        const next = sinon.spy();

        userModel.checkToken(req, res, next);


        expect(req.body.user_id).to.equal(users[0].id);

        expect(next).to.have.been.calledOnce;
        expect(res.status.notCalled).to.be.true;
        expect(res.json.notCalled).to.be.true;
    });
    it('tests login method, ok', async () => {
        const req = { body: { token: 'validToken' } };
        const res = { json: sinon.stub() };
        const expectedEmail = 'existing@user.com';
        const expectedPayload = {};
        const extractEmailStub = sinon.stub(userModel, 'extractEmail').returns(expectedEmail);
        const dbStub = sinon.stub(userModel, 'db').resolves(expectedPayload);

        await userModel.login(req, res, sinon.stub());

        expect(extractEmailStub).to.have.been.calledOnce;
        expect(dbStub).to.have.been.calledOnceWith(expectedEmail);

        const expectedResult = {
            data: {
            type: "success",
            message: "User logged in",
            user: expectedPayload,
            token: sinon.match.string
            }
        };
        expect(res.json).to.have.been.calledOnceWithExactly(expectedResult);

        extractEmailStub.restore();
        dbStub.restore();
    });
    it('tests login method, email is not in db, ok', async () => {
        const req = { body: { token: 'validToken' } };
        const res = { json: sinon.stub() };
        // const next = sinon.spy();
        const expectedEmail = 'existing@user.com';
        const expectedPayload = {};
        const extractEmailStub = sinon.stub(userModel, 'extractEmail').returns(expectedEmail);
        const dbStub = sinon.stub(userModel, 'db').resolves(expectedPayload);

        await userModel.login(req, res, sinon.stub());

        expect(extractEmailStub).to.have.been.calledOnce;
        expect(dbStub).to.have.been.calledOnceWith(expectedEmail);

        const expectedResult = {
            data: {
            type: "success",
            message: "User logged in",
            user: expectedPayload,
            token: sinon.match.string
            }
        };
        expect(res.json).to.have.been.calledOnceWithExactly(expectedResult);

        extractEmailStub.restore();
        dbStub.restore();

    });
    it('get all users', async () => {
        const users = await userModel.all()
        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('user serach exact id ok', async () => {
        const users = await userModel.search(6);
        expect(users[0]).to.deep.equal({
            id: 6,
            email: "afolonind@statcounter.com",
            balance: -128.53,
            active: true,
        });
    });
    it('user search exact id not ok', async () => {
        try {
            await userModel.search(8);
            throw new Error("Expected SqlError (No users matched the search-criteria)");
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include("No users matched the search-criteria");
        }
    });
    it('user search exact email ok', async () => {
        const users = await userModel.search("jdoniso4@alibaba.com");
        expect(users[0]).to.deep.equal({
            id: 4,
            email: "jdoniso4@alibaba.com",
            balance: 261.93,
            active: true,
        });
    });
    it('user search partial email one ok', async () => {
        let users = await userModel.search("%so4@alibaba.com");
        expect(users[0]).to.deep.equal({
            id: 4,
            email: "jdoniso4@alibaba.com",
            balance: 261.93,
            active: true,
        });
        users = await userModel.search("bcroft7@qq.c%");
        expect(users[0]).to.deep.equal({
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        });
        users = await userModel.search("%nind@statcounter.%");
        expect(users[0]).to.deep.equal({
            id: 6,
            email: "afolonind@statcounter.com",
            balance: -128.53,
            active: true,
        });
    });
    it('user search partial email many ok', async () => {
        let users = await userModel.search("%ni%");

        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
        ]);
    });
    it('get all users pag offset 1, limit 2', async () => {
        const users = await userModel.allPag(1, 2)
        expect(users).to.deep.equal([
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            }
        ]);
    });
    it('get all users pag offset 1, limit 5 (db contains only 4 users)', async () => {
        const users = await userModel.allPag(1, 5)
        expect(users).to.deep.equal([
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('get all users pag offset 1, limit 3', async () => {
        const users = await userModel.allPag(1, 3)
        expect(users).to.deep.equal([
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('get all users pag offset 2, limit 3', async () => {
        const users = await userModel.allPag(2, 3)
        expect(users).to.deep.equal([
            {
                id: 6,
                email: "afolonind@statcounter.com",
                balance: -128.53,
                active: true,
            },
            {
                id: 7,
                email: "another_one@user.com",
                balance: -1200.31,
                active: false,
            }
        ]);
    });
    it('get all users pag offset 0, limit 2', async () => {
        const users = await userModel.allPag(0, 2)
        expect(users).to.deep.equal([
            {
                id: 4,
                email: "jdoniso4@alibaba.com",
                balance: 261.93,
                active: true,
            },
            {
                id: 5,
                email: "bcroft7@qq.com",
                balance: -372.87,
                active: false,
            },
        ]);
    });

    it('update user status', async () => {
        let updated = await userModel.updStatus(5, true);
        expect(updated).to.deep.equal({
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: true,
        });
        updated = await userModel.updStatus(5, false);
        expect(updated).to.deep.equal({
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        });
    });

    it('update user email', async () => {
        const updated = await userModel.updEmail(5, "new@email.com");
        expect(updated).to.deep.equal({
            id: 5,
            email: "new@email.com",
            balance: -372.87,
            active: false,
        });
    });
    it('tests db method (used in login), email ok)', async () => {
        const user = await userModel.db("afolonind@statcounter.com");
        expect(user).to.deep.equal({
            id: 6,
            email: "afolonind@statcounter.com",
        });
    });

    it('tests db method (used in login), email ok but inactive)', async () => {
        let user;
        try {
            user = await userModel.db("bcroft7@qq.com");
            throw new Error("Expected Error (User is deactivated)");
        } catch (error) {
            expect(error.message).to.include("User is deactivated");
        }
        expect(user).to.be.an.undefined;
    });
    it('tests login method, email ok but inactive', async () => {
        const extractEmailStub = sinon.stub(userModel, 'extractEmail').returns('bcroft7@qq.com');
        const nextMock = sinon.spy();

        const req = {
            body: {
                token: 'ghToken'
            }
        };

        const res = {
            json: sinon.stub()
        };
        await userModel.login(req, res, nextMock);

        sinon.assert.calledOnceWithExactly(extractEmailStub, 'ghToken');
        sinon.assert.calledOnce(nextMock);
        extractEmailStub.restore();
    });
    it('update user email, email missing', async () => {

        let updated;

        try {
            // try passing undefined instead of email
            updated = await userModel.updEmail(5, undefined);
            throw new Error('Expected SqlError (email column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'email' cannot be null");
        }
        expect(updated).to.be.an.undefined;

        const notUpdated = await userModel.search(5);
        expect(notUpdated).to.deep.equal([{
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        }]);
    });

    it('tests login method, ok, new user', async () => {
        const req = { body: { token: 'validGithubToken' } };
        const res = { json: sinon.stub() };
        const newEmail = 'new@user.com';
        const expectedPayload = {
            id: sinon.match.number,
            email: newEmail
        };

        const extractEmailStub = sinon.stub(userModel, 'extractEmail').returns(newEmail);

        await userModel.login(req, res, sinon.stub());

        expect(extractEmailStub).to.have.been.calledOnce;

        const expectedResult = {
            data: {
            type: "success",
            message: "User logged in",
            user: expectedPayload,
            token: sinon.match.string
            }
        };
        expect(res.json).to.have.been.calledOnceWithExactly(expectedResult);

        extractEmailStub.restore();
    });

    // Add test for:

    //1. get token from github



});
