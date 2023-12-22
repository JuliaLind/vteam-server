/* global it describe beforeEach after */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import tripModel from "../src/models/trip.js";


import { insertData } from './helper.js';
let trips;
let dataAdj;
let users;
let cards;
let bikes;
let payments;

describe('trip model part 2', () => {
    beforeEach(async () => {
        [users, cards, payments, bikes, trips] = await insertData();
        dataAdj = trips.reverse();
    });
    after(async () => {
        const conn = await db.pool.getConnection();

        let sql = `DELETE FROM trip;
        DELETE FROM payment;
        DELETE FROM user_card;
        DELETE FROM user;
        DELETE FROM bike;`;
        await conn.query(sql);
        if (conn) {
            conn.end();
        }
    })
    it('get all trips', async () => {
        let res = await tripModel.allTrips();
        expect(res.length).to.equal(15);
        expect(res).to.deep.equal(dataAdj);
    });

    it('get all trips paginated', async () => {
        let res = await tripModel.allTripsPag(2, 5);
        expect(res.length).to.equal(5);
        expect(res).to.deep.equal(dataAdj.slice(2, 2 + 5));

        res = await tripModel.allTripsPag(1, 8);
        expect(res.length).to.equal(8);
        expect(res).to.deep.equal(dataAdj.slice(1, 1 + 8));

        // out of range, 15 elements total
        res = await tripModel.allTripsPag(12, 20);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(dataAdj.slice(12, 20));
    });

    it('get all trips for a user', async () => {

        // user 6
        let userTrips = dataAdj.filter((elem) => elem.user_id === 6);
        let res = await tripModel.userTrips(6);
        expect(res.length).to.equal(7);
        expect(res).to.deep.equal(userTrips);

        // user 7
        userTrips = dataAdj.filter((elem) => elem.user_id === 7);
        res = await tripModel.userTrips(7);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips);

        
        // user 5
        userTrips = dataAdj.filter((elem) => elem.user_id === 5);
        res = await tripModel.userTrips(5);
        expect(res.length).to.equal(5);
        expect(res).to.deep.equal(userTrips);
    });

    it('get all trips for a user paginated', async () => {

        // user 6
        let userTrips = dataAdj.filter((elem) => elem.user_id === 6);
        let res = await tripModel.userTripsPag(6, 2, 3);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips.slice(2, 2 + 3));

        res = await tripModel.userTripsPag(6, 3, 3);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips.slice(3, 3 + 3));

        res = await tripModel.userTripsPag(6, 3, 5);
        // because only 7 elemens in tital so, 3 + 4
        expect(res.length).to.equal(4);
        expect(res).to.deep.equal(userTrips.slice(3, 3 + 5));


        // user 5
        userTrips = dataAdj.filter((elem) => elem.user_id === 5);
        res = await tripModel.userTripsPag(5, 2, 3);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips.slice(2, 2 + 3));

        // non-existsing user
        res = await tripModel.userTripsPag(9, 2, 3);
        expect(res.length).to.equal(0);
        expect(res).to.deep.equal([]);
    });
});

