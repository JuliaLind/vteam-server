/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import paymentModel from "../src/models/payment.js";
import userModel from "../src/models/user.js";


describe('payment model', () => {
    const users = [
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
            email: "jdoniso4@alibaba.com",
            card: "5362 1630 1011 0910",
            card_type: 2,
            balance: 261.93,
            active: true,
        }
    ];
    beforeEach(async () => {
        const conn = await db.pool.getConnection()
        let sql = `
        DELETE FROM payment;
        DELETE FROM user;
        INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`;

        let args = [
            users[0].id, users[0].email, users[0].card, users[0].card_type, users[0].balance, users[0].active,
            users[1].id, users[1].email, users[1].card, users[1].card_type, users[1].balance, users[1].active,
            users[2].id, users[2].email, users[2].card, users[2].card_type, users[2].balance, users[2].active,

        ];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    after(async () => {
        const conn = await db.pool.getConnection()
        let sql = `
        DELETE FROM payment;`;

        await conn.query(sql);
        if (conn) {
            conn.end();
        }
    });
    it('Invoice + userPayments', async () => {
        const data = await paymentModel.invoice();

        expect(data).to.deep.equal({
            invoiced_users: 2,
            invoiced_amount: 372.87 + 128.53
        });

        const users = await userModel.all();
        for (const user of users) {
            switch (user.id) {
                case 5:
                    expect(user.balance).to.equal(0);
                    break;
                case 6:
                    expect(user.balance).to.equal(0);
                    break;
                case 7:
                    expect(user.balance).to.equal(261.93);
                    break;
                default:
                  console.log('Check the tests');
            }
        }

        const payments7 = await paymentModel.userPayments(7);
        expect(payments7).to.deep.equal([]);

        const payments5 = await paymentModel.userPayments(5);


        expect(payments5[0].user_id).to.equal(5);
        expect(payments5[0].date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(payments5[0].ref).to.equal("AUTO ***5300");
        expect(payments5[0].amount).to.equal(372.87);

        const payments6 = await paymentModel.userPayments(6);

        expect(payments6[0].user_id).to.equal(6);
        expect(payments6[0].date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(payments6[0].ref).to.equal("AUTO ***3920");
        expect(payments6[0].amount).to.equal(128.53);

    });
    it('prepay, number is ok', async () => {
        const receipt = await paymentModel.prepay(5, 2000);

        expect(receipt.user_id).to.equal(5);
        expect(receipt.date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(receipt.ref).to.equal("***5300");
        expect(receipt.amount).to.equal(2000);
        expect(receipt.balance).to.equal(2000 - 372.87);
    });
    it('prepay, number is negative', async () => {
        try {
            // try invalid number
            await paymentModel.prepay(5, -1);
        
            // this row will not be executed if the above function throws an error as expected
            throw new Error('Expected SqlError (Payment amount must be larger than 0)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('Payment amount must be larger than 0');
        }
        const payments = await paymentModel.userPayments(5)

        expect(payments).to.deep.equal([]);

        const user = await userModel.search(5);
        expect(user[0].balance).to.equal(-372.87);
    });
});
// add tests for:
// 1. transactions paginated
// 2. transactions (flera)
