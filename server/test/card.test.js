/* global it describe beforeEach */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import cardModel from "../src/models/card.js";
import { insertData } from './helper.js'
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

let users;
let cards;
let payments;
let bikes;
let trips;


describe('card model', () => {
    beforeEach(async () => {
        [users, cards, payments, bikes, trips] = await insertData();
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
        let cardDetails = await cardModel.userDetails(users[3].id);

        expect(cardDetails).to.deep.equal(
            cards[3]
        );

        cardDetails = await cardModel.userDetails(users[2].id);

        expect(cardDetails).to.deep.equal(cards[2]);

        cardDetails = await cardModel.userDetails(users[1].id);

        expect(cardDetails).to.deep.equal(cards[1]);

        cardDetails = await cardModel.userDetails(0);

        expect(cardDetails).to.be.an('undefined');
    });
    it('Update card details for a user', async () => {
        let cardDetails = await cardModel.updUserDetails(users[1].id, "1234 5678 9123 4567", 2);

        expect(cardDetails).to.deep.equal({
            card_nr: "1234 5678 9123 4567",
            card_type: 2,
            card_type_descr: "Mastercard"
        });
    });
    it('try to update card details to empty string, should not work', async () => {
        let cardDetails;
        const emptyString = "   ";
        try {
            // try invalid card type
            cardDetails = await cardModel.updUserDetails(users[2].id, emptyString, 2);
            throw new Error("Expected Error (invalid cardnr)");
        } catch (error) {
            expect(error.message).to.include("invalid cardnr");
        }

        cardDetails = await cardModel.userDetails(users[2].id);

        expect(cardDetails).to.not.deep.equal({
            card_nr: emptyString,
            card_type: 2,
            card_type_descr: sinon.match.string
        });
        expect(cardDetails).to.deep.equal(cards[2]);
    });
    it('Will not update card details if invalid card type', async () => {
        let cardDetails;
        try {
            // try invalid card type
            cardDetails = await cardModel.updUserDetails(users[2].id, "1234 5678 9123 4567", 9);
            throw new Error('Expected SqlError (foreign key constraint violation)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include('foreign key constraint');
        }

        cardDetails = await cardModel.userDetails(users[2].id);

        expect(cardDetails).to.not.deep.equal({
            card_nr: "1234 5678 9123 4567",
            card_type: 9,
            card_type_descr: sinon.match.string
        });
        expect(cardDetails).to.deep.equal(cards[2]);
    });
    it('Will not update card details if card number is missing', async () => {
        let cardDetails;
        try {
            // try no cardnr
            cardDetails = await cardModel.updUserDetails(users[3].id, undefined, 2);
            throw new Error("Expected Error (invalid cardnr)");
        } catch (error) {
            expect(error.message).to.include("invalid cardnr");
        }

        cardDetails = await cardModel.userDetails(users[3].id);
        expect(cardDetails).to.deep.equal(cards[3]);
    });
});
