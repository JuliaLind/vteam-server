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
            balance: -128.53,
            active: true,
        },
        {
            id: 7,
            email: "another_one@user.com",
            card: "4844 9104 3434 3920",
            card_type: 3,
            balance: -1200.31,
            active: false,
        }
    ];
    beforeEach(async () => {
        const conn = await db.pool.getConnection();

        let sql = `DELETE FROM user;
        INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`;

        let args = [
            users[0].id, users[0].email, users[0].card, users[0].card_type, users[0].balance, users[0].active,
            users[1].id, users[1].email, users[1].card, users[1].card_type, users[1].balance, users[1].active,
            users[2].id, users[2].email, users[2].card, users[2].card_type, users[2].balance, users[2].active,
            users[3].id, users[3].email, users[3].card, users[3].card_type, users[3].balance, users[3].active,


        ];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
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

        const searchRes = await userModel.search("testuser@email.com");
        user = searchRes[0];
        expect(Object.keys(user).length).to.equal(4);
        expect(user.email).to.equal("testuser@email.com");
        expect(user.id).to.be.a('number');
        expect(user.balance).to.equal(0.00);
        expect(user.active).to.be.true;
    });
    it('registers new user in database, email missing', async () => {
        try {
            // try passing undefined instead of email
            await userModel.insertIntoDB(
                undefined,
                "1234 5678 9123 4567",
                3
            )
            // this row will not be executed if the above function throws an error as expected
            throw new Error('Expected SqlError (email column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'email' cannot be null");
        }

        const users = await userModel.all();
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

    it('registers new user in database, cardnr missing', async () => {
        try {
            // try passing undefined instead of email
            await userModel.insertIntoDB(
                "the@newuser.com",
                undefined,
                3
            )
            // this row will not be executed if the above function throws an error as expected
            throw new Error('Expected SqlError (card_nr column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'card_nr' cannot be null");
        }

        const users = await userModel.search("the@newuser.com");
        expect(users).to.deep.equal([]);
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
        let updated = await userModel.updEmail(5, "new@email.com");
        expect(updated).to.deep.equal({
            id: 5,
            email: "new@email.com",
            balance: -372.87,
            active: false,
        });
    });


    it('update user email, email missing', async () => {

        let updated;

        try {
            // try passing undefined instead of email
            updated = await userModel.updEmail(5, undefined);
            // this row will not be executed if the above function throws an error as expected
            throw new Error('Expected SqlError (email column cannot be null)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include("Column 'email' cannot be null");
        }

        const notUpdated = await userModel.search(5);
        expect(notUpdated).to.deep.equal([{
            id: 5,
            email: "bcroft7@qq.com",
            balance: -372.87,
            active: false,
        }]);
    });

    // Add test for:

    //1. get token from github
    // 2. register
    // 3. login
});
