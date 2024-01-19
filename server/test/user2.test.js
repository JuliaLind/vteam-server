/* global it describe before afterEach */

import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import userModel from "../src/models/user.js";

import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET;

import sinonChai from 'sinon-chai';
chai.use(sinonChai);



describe('user model, password reg', () => {
    // afterEach(async () => {
    //     const conn = await db.pool.getConnection();
    //     let sql = `
    //     DELETE FROM user_hash;
    //     DELETE FROM user;
    //     `;
    //     await conn.query(sql);
    //     if (conn) {
    //         conn.end();
    //     }
    // });
    it('tests register and login with password method, ok', async () => {
        const email = "new_user@hotmail.com";
        const password = "newuser";
        const req = {
            headers: {},
            body: {
                email: email,
                password: password
            }
        };
        const res = {};
        res.status = sinon.stub().returnsThis();
        res.json = sinon.stub();
        const next = sinon.spy();

        await userModel.register_pass(req, res, next);

        expect(res.json.calledOnceWithExactly({
            data: {
                type: "success",
                message: "User successfully registered",
                user: sinon.match({
                    id: sinon.match.number,
                    email: email
                }),
                token: sinon.match.string
            }
        }));
        expect(next.called).to.be.false;

        await userModel.login_pass(req, res, next);

        expect(res.json.calledOnceWithExactly({
            data: {
                type: "success",
                message: "User successfully logged in",
                user: sinon.match({
                    id: sinon.match.number,
                    email: email
                }),
                token: sinon.match.string
            }
        }));
        expect(next.called).to.be.false;
    });

});
