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

describe('trip model part 2', () => {
    beforeEach(async () => {
        const res = await insertData();
        trips = res.trips;
        users = res.users;
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
        const res = await tripModel.allTrips();
        expect(res.length).to.equal(15);
        expect(res).to.deep.equal(dataAdj);
    });

    it('get all trips paginated', async () => {
        const res = await tripModel.allTripsPag(2, 5);
        expect(res.length).to.equal(5);
        expect(res).to.deep.equal(dataAdj.slice(2, 2 + 5));
    });
    it('get all trips paginated another range', async () => {
        const res = await tripModel.allTripsPag(1, 8);
        expect(res.length).to.equal(8);
        expect(res).to.deep.equal(dataAdj.slice(1, 1 + 8));
    });
    it('get all trips paginated out of range ok', async () => {
        // out of range, 15 elements total
        const res = await tripModel.allTripsPag(12, 20);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(dataAdj.slice(12, 20));
    });

    it('get all trips for a user', async () => {

        // user 6
        let userTrips = dataAdj.filter((elem) => elem.user_id === users[2].id);
        let res = await tripModel.userTrips(users[2].id);
        expect(res.length).to.equal(7);
        expect(res).to.deep.equal(userTrips);

        // user 7
        userTrips = dataAdj.filter((elem) => elem.user_id === users[3].id);
        res = await tripModel.userTrips(users[3].id);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips);

        
        // user 5
        userTrips = dataAdj.filter((elem) => elem.user_id === users[1].id);
        res = await tripModel.userTrips(users[1].id);
        expect(res.length).to.equal(5);
        expect(res).to.deep.equal(userTrips);
    });

    it('get all trips for a user paginated', async () => {

        // user 6
        let userTrips = dataAdj.filter((elem) => elem.user_id === users[2].id);
        let res = await tripModel.userTripsPag(users[2].id, 2, 3);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips.slice(2, 2 + 3));

        res = await tripModel.userTripsPag(users[2].id, 3, 3);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips.slice(3, 3 + 3));

        res = await tripModel.userTripsPag(users[2].id, 3, 5);
        // because only 7 elemens in tital so, 3 + 4
        expect(res.length).to.equal(4);
        expect(res).to.deep.equal(userTrips.slice(3, 3 + 5));


        // user 5
        userTrips = dataAdj.filter((elem) => elem.user_id === users[1].id);
        res = await tripModel.userTripsPag(users[1].id, 2, 3);
        expect(res.length).to.equal(3);
        expect(res).to.deep.equal(userTrips.slice(2, 2 + 3));

        // non-existsing user
        res = await tripModel.userTripsPag(0, 2, 3);
        expect(res.length).to.equal(0);
        expect(res).to.deep.equal([]);
    });
});

