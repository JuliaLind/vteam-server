/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import paymentModel from "../src/models/payment.js";
import userModel from "../src/models/user.js";
import { users } from './dummy-data/users.js'
import { payments } from './dummy-data/payments.js'

async function insertSomePayments() {
    // const conn = await db.pool.getConnection()

    // let placeholders = "";
    // let args = [];

    // let counter = 1;
    // for (const payment of payments) {
    //     args = args.concat([payment.id, payment.user_id, payment.date, payment.ref, payment.amount]);
    //     placeholders += "(?, ?, ?, ?, ?)";
    //     if (counter < payments.length) {
    //         placeholders += ",";
    //     }

    //     counter += 1;
    // }
    // let sql = `
    // DELETE FROM payment;
    // INSERT INTO payment VALUES${placeholders};`;

    // await conn.query(sql, args);
    // if (conn) {
    //     conn.end();
    // }
    let data = [];
    for (const elem of payments) {
        let newElem = {
            ...elem
        };
        let inserted = await paymentModel.prepay(elem.
            user_id, elem.amount);
        newElem.id = inserted.id;
        newElem.date = inserted.date;
        data.push(newElem);
    }
    return data;
}

describe('payment model', () => {
    beforeEach(async () => {
        const conn = await db.pool.getConnection()
        let sql = `
        DELETE FROM payment;
        DELETE FROM user;
        INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`;

        let args = [];

        for (const user of users) {
            args = args.concat([user.id, user.email, user.card, user.card_type, user.balance, user.active]);
        }

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
            invoiced_users: 3,
            invoiced_amount: 372.87 + 128.53 + 1200.31
        });

        const users = await userModel.all();
        for (const user of users) {
            switch (user.id) {
                case 4:
                    expect(user.balance).to.equal(261.93);
                    break;
                case 5:
                    expect(user.balance).to.equal(0);
                    break;
                case 6:
                    expect(user.balance).to.equal(0);
                    break;
                case 7:
                    expect(user.balance).to.equal(0);
                    break;
                default:
                  console.error('Check the tests');
            }
        }

        const payments4 = await paymentModel.userPayments(4);
        expect(payments4).to.deep.equal([]);

        const payments7 = await paymentModel.userPayments(7);


        expect(payments7[0].user_id).to.equal(7);
        expect(payments7[0].date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(payments7[0].ref).to.equal("AUTO ***3920");
        expect(payments7[0].amount).to.equal(1200.31);

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
        
            throw new Error('Expected SqlError (Payment amount must be larger than 0)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('Payment amount must be larger than 0');
        }
        const data = await paymentModel.userPayments(5)

        expect(data).to.deep.equal([]);

        const user = await userModel.search(5);
        expect(user[0].balance).to.equal(-372.87);
    });
    it('all payments', async () => {
        let exp = await insertSomePayments();
        let res = await paymentModel.allPayments();


        expect(res).to.deep.equal(exp.reverse());
    });

    it('user_payments', async () => {
        let exp = await insertSomePayments();
        const data4 = exp.filter(elem => elem.user_id === 4);
        const data5 = exp.filter(elem => elem.user_id === 5);
        const data6 = exp.filter(elem => elem.user_id === 6);
        const data7 = exp.filter(elem => elem.user_id === 7);

        let data = await paymentModel.userPayments(4);

        expect(data).to.deep.equal(data4.reverse());
        data = await paymentModel.userPayments(5);
        expect(data).to.deep.equal(data5.reverse());
        data = await paymentModel.userPayments(6);
        expect(data).to.deep.equal(data6.reverse());
        data = await paymentModel.userPayments(7);
        expect(data).to.deep.equal(data7.reverse());
    });
});
// add tests for:
// 1. transactions paginated
// 2. transactions (flera)
