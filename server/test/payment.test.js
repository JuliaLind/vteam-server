/* global it describe beforeEach after */

import chai from 'chai';
chai.should();
const expect = chai.expect;

import { db } from "../src/models/db.js";
import paymentModel from "../src/models/payment.js";
import userModel from "../src/models/user.js";
import { insertData } from './helper.js'


describe('payment model', () => {
    let payments;
    let users;
    let cards;

    beforeEach(async () => {
        const res = await insertData();

        payments = res.payments;
        users = res.users;
        cards = res.cards;

        payments.sort((a, b) => b.date - a.date);

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
    it('invoice + userPayments', async () => {
        const data = await paymentModel.invoice();

        expect(data).to.deep.equal({
            invoiced_users: 3,
            invoiced_amount: 372.87 + 128.53 + 1200.31
        });

        const usersFromDb = await userModel.all();

        const balances = usersFromDb.map(user => user.balance);
        expect(balances).to.deep.equal([261.93, 0, 0, 0])

        const payments0 = await paymentModel.userPayments(users[0].id);
        expect(payments0).to.deep.equal(payments.filter((elem) => elem.user_id === users[0].id));

        const payments1 = await paymentModel.userPayments(users[1].id);


        expect(payments1[0].user_id).to.equal(users[1].id);
        expect(payments1[0].date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(payments1[0].ref).to.equal("AUTO ***" + cards[1].card_nr.substring(cards[1].card_nr.length - 4));
        expect(payments1[0].amount).to.equal(372.87);

        const payments2 = await paymentModel.userPayments(users[2].id);


        expect(payments2[0].user_id).to.equal(users[2].id);
        expect(payments2[0].date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(payments2[0].ref).to.equal("AUTO ***" + cards[2].card_nr.substring(cards[2].card_nr.length - 4));
        expect(payments2[0].amount).to.equal(128.53);

        const payments3 = await paymentModel.userPayments(users[3].id);

        expect(payments3[0].user_id).to.equal(users[3].id);
        expect(payments3[0].date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(payments3[0].ref).to.equal("AUTO ***" + cards[3].card_nr.substring(cards[3].card_nr.length - 4));
        expect(payments3[0].amount).to.equal(1200.31);

    });
    it('prepay, number is ok', async () => {
        const receipt = await paymentModel.prepay(users[1].id, 2000);

        expect(receipt.user_id).to.equal(users[1].id);
        expect(receipt.date.toISOString().substring(0, 10)).to.equal((new Date()).toISOString().substring(0, 10));
        expect(receipt.ref).to.equal("***" + cards[1].card_nr.substring(cards[1].card_nr.length - 4));
        expect(receipt.amount).to.equal(2000);
        expect(receipt.balance).to.equal(2000 - 372.87);
    });
    it('prepay, number is negative', async () => {
        try {
            // try invalid number
            await paymentModel.prepay(users[1].id, -1);
        
            throw new Error('Expected SqlError (Payment amount must be larger than 0)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('Payment amount must be larger than 0');
        }
        const data = await paymentModel.userPayments(users[1].id)

        expect(data).to.deep.equal(payments.filter((elem) => elem.user_id === users[1].id));

        const user = await userModel.search(users[1].id);
        expect(user[0].balance).to.equal(-372.87);
    });
    it('all_payments', async () => {
        const res = await paymentModel.allPayments();


        expect(res).to.deep.equal(payments);
    });

    it('user_payments, tests 4 user payment sets', async () => {
        const data0 = payments.filter(elem => elem.user_id === users[0].id);
        const data1 = payments.filter(elem => elem.user_id === users[1].id);
        const data2 = payments.filter(elem => elem.user_id === users[2].id);
        const data3 = payments.filter(elem => elem.user_id === users[3].id);

        let data = await paymentModel.userPayments(users[0].id);

        expect(data).to.deep.equal(data0);
        data = await paymentModel.userPayments(users[1].id);
        expect(data).to.deep.equal(data1);
        data = await paymentModel.userPayments(users[2].id);
        expect(data).to.deep.equal(data2);
        data = await paymentModel.userPayments(users[3].id);
        expect(data).to.deep.equal(data3);
    });

    it('all_payments_pag within and outside range', async () => {
        let res = await paymentModel.allPaymentsPag(3, 4);

        // within range
        expect(res).to.deep.equal(payments.slice(3, 3 + 4));
        expect(res.length).to.equal(4);

        res = await paymentModel.allPaymentsPag(0,10);
        expect(res).to.deep.equal(payments.slice(0, 10));

        // almost out of range
        res = await paymentModel.allPaymentsPag(10, 15);
        expect(res).to.deep.equal(payments.slice(10, 10 + 15));

        // completely out of range
        res = await paymentModel.allPaymentsPag(15, 5);
        expect(res).to.deep.equal(payments.slice(15, 15 + 5));
    });

    it('user_payments_pag within and outside range', async () => {
        const exp6 = payments.filter(elem => elem.user_id === users[2].id);

        let data = await paymentModel.userPaymentsPag(users[2].id, 2, 2);
        expect(data.length).to.equal(2);

        expect(data).to.deep.equal(exp6.slice(2, 2 + 2));
        data = await paymentModel.userPaymentsPag(users[2].id, 1, 3);
        expect(data.length).to.equal(3);
        expect(data).to.deep.equal(exp6.slice(1, 1 + 3));

        data = await paymentModel.userPaymentsPag(users[2].id, 2, 6);
        expect(data.length).to.equal(3);
        expect(data).to.deep.equal(exp6.slice(2, 2 + 6));
    });
    
});

