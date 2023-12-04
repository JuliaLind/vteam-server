/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import paymentModel from "../src/models/payment.js";





describe('payment model', () => {
    const users = [
        {
            id: 7,
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
    })
    it('Invoice', async () => {
        const data = await paymentModel.invoice();

        expect(data).to.deep.equal({
            invoiced_users: 2,
            invoiced_amount: 372.87 + 128.53
        });
    });
    it('prepay', async () => {
        const receipt = await paymentModel.prepay(5, 2000);

        expect(receipt.user_id).to.equal(5);
        expect(receipt.date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(receipt.ref).to.equal("***5300");
        expect(receipt.amount).to.equal(2000);
        expect(receipt.balance).to.equal(2000 - 372.87);
    });
});
