/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import cardModel from "../src/models/card.js";





describe('card model', () => {
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
    it('Get all cardtypes', async () => {
        const cardTypes = await cardModel.getTypes();

        expect(cardTypes).to.deep.equal([
            {
                "id": 1,
                "name": "Visa"
            },
            {
                "id": 2,
                "name": "Mastercard"
            },
            {
                "id": 3,
                "name": "American Express"
            }
        ]);
    });
    it('Get card details for a user', async () => {
        let cardDetails = await cardModel.userDetails(6);

        expect(cardDetails).to.deep.equal({
            card_nr: "4844 9104 5482 3920",
            card_type: 3,
            card_type_descr: "American Express"
        });

        cardDetails = await cardModel.userDetails(4);

        expect(cardDetails).to.deep.equal({
            card_nr: "5362 1630 1011 0910",
            card_type: 2,
            card_type_descr: "Mastercard"
        });

        cardDetails = await cardModel.userDetails(5);

        expect(cardDetails).to.deep.equal({
            card_nr: "4508 1325 6002 5300",
            card_type: 1,
            card_type_descr: "Visa"
        });

        cardDetails = await cardModel.userDetails(7);

        expect(cardDetails).to.be.an('undefined');
    });
    it('Update card details for a user', async () => {
        let cardDetails = await cardModel.updUserDetails(6, "1234 5678 9123 4567", 2);

        expect(cardDetails).to.deep.equal({
            card_nr: "1234 5678 9123 4567",
            card_type: 2,
            card_type_descr: "Mastercard"
        });
    });
    it('Will not update card details if invalid card type', async () => {
        let cardDetails;
        try {
            // try invalid charge range too high
            cardDetails = await cardModel.updUserDetails(6, "1234 5678 9123 4567", 9);
            // this row will not be executed if the above function throws an error as expected
            throw new Error('Expected SqlError (foreign key constraint violation)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include('foreign key constraint');
        }

        cardDetails = await cardModel.userDetails(6);
        expect(cardDetails).to.deep.equal({
            card_nr: "4844 9104 5482 3920",
            card_type: 3,
            card_type_descr: "American Express"
        });
    });
});
