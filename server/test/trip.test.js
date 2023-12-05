/* global it describe */

import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import userModel from "../src/models/user.js";
import tripModel from "../src/models/trip.js";
import { bikes } from './dummy-bikes.js';
import { users } from './dummy-users.js';



describe('trip model', () => {
    beforeEach(async () => {
        const conn = await db.pool.getConnection();

        let sql = `
        DELETE FROM trip;
        DELETE FROM user;
        INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);
            DELETE FROM bike;
            INSERT INTO bike
            VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`;

        let args = [
            users[0].id, users[0].email, users[0].card, users[0].card_type, users[0].balance, users[0].active,
            users[1].id, users[1].email, users[1].card, users[1].card_type, users[1].balance, users[1].active,
            users[2].id, users[2].email, users[2].card, users[2].card_type, users[2].balance, users[2].active,
            users[3].id, users[3].email, users[3].card, users[3].card_type, users[3].balance, users[3].active,
            bikes[0].id, bikes[0].city_id, bikes[0].status_id, bikes[0].charge_perc, bikes[0].coords, bikes[0].active,
            bikes[1].id, bikes[1].city_id, bikes[1].status_id, bikes[1].charge_perc, bikes[1].coords, bikes[1].active,
            bikes[2].id, bikes[2].city_id, bikes[2].status_id, bikes[2].charge_perc, bikes[2].coords, bikes[2].active


        ];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    after(async () => {
        const conn = await db.pool.getConnection();

        let sql = `DELETE FROM trip;`;
        await conn.query(sql);
        if (conn) {
            conn.end();
        }
    })
    it('starts a trip, ok', async () => {
        const trip = await tripModel.start(4, 6);
        expect(Object.values(trip).length).to.equal(5);
        expect(trip.user_id).to.equal(4);
        expect(trip.bike_id).to.equal(6);
        expect(trip.start_pos).to.deep.equal([11.9721,57.70229]);
        expect(Math.abs(new Date - trip.start_time)/1000).to.be.lessThan(1);
        const trips = await tripModel.userTrips(4);
        expect(trips.length).to.equal(1);
        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        expect(trips[0].user_id).to.equal(4);
        expect(trips[0].bike_id).to.equal(6);
        expect(trips[0].end_time).to.be.null;
        expect(trips[0].end_pos).to.be.null;
        expect(trips[0].start_pos).to.deep.equal([11.9721,57.70229]);
        expect(trips[0].start_cost).to.be.null;
        expect(trips[0].var_cost).to.be.null;
        expect(trips[0].park_cost).to.be.null;

    });

    it('cannot start a trip because bike inactive', async () => {

        let trip;
        try {
            // bike 5 has active = false
            trip = await tripModel.start(4, 5);
            throw new Error('Expected SqlError (Cannot rent bike 5)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('Cannot rent bike 5');
        }

        const trips = await tripModel.userTrips(4);
        expect(trips.length).to.equal(0);
    })

    // Add test for:

    //1. start a trip ok
    // 2. start a trip, bike taken
    // 3. repeated request to start trip
    // 4. end a trip ok (check trip, check balance)
    // 5. end a trip, wrong user
    // end a trip, repeated request
});
