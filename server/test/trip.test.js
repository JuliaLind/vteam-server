/* global it describe */

import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import userModel from "../src/models/user.js";
import tripModel from "../src/models/trip.js";
import { bikes } from './dummy-data/bikes.js';
import { users } from './dummy-data/users.js';
import { zones, points } from './dummy-data/zones.js';



describe('trip model', () => {
    beforeEach(async () => {
        const conn = await db.pool.getConnection();

        let sql = `
        DELETE FROM zone_loc;
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
            (?, ?, ?, ?, ?, ?);
        INSERT INTO zone_loc
        VALUES(?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?);`;

        let args = [];

        for (const user of users) {
            args = args.concat([user.id, user.email, user.card, user.card_type, user.balance, user.active]);
        }
        for (const bike of bikes) {
            args = args.concat([bike.id, bike.city_id, bike.status_id, bike.charge_perc, bike.coords, bike.active]);
        }
        for (const zone of zones) {
            args = args.concat([zone.id, zone.zone_id, zone.city_id, zone.date_from, JSON.stringify(zone.geometry)]);
        }

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
        expect(Math.abs(new Date - trip.start_time)/1000).to.be.lessThan(1);

        delete trip.start_time;
        expect(trip).to.deep.equal({
            id: trip.id,
            user_id: 4,
            bike_id: 6,
            start_pos: [11.9721,57.70229],
        })


        const trips = await tripModel.userTrips(4);
        expect(trips.length).to.equal(1);
        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        delete trips[0].start_time;
        expect(trips[0]).to.deep.equal({
            id: trip.id,
            user_id: 4,
            bike_id: 6,
            start_pos: [11.9721,57.70229],
            end_time: null,
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });


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
    });

    it('cannot start a trip again because bike has status "rented", same error even if user same', async () => {

        await tripModel.start(4, 6);
        let secondTrip;
        try {
            // bike 5 has status rented
            secondTrip = await tripModel.start(4, 6);
            throw new Error('Expected SqlError (Cannot rent bike 6)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('Cannot rent bike 6');
        }
        expect(secondTrip).to.be.an.undefined;
        const trips = await tripModel.userTrips(4);
        expect(trips.length).to.equal(1);
        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        delete trips[0].start_time;

        // check that no changes were done to the trip initiated by first user
        expect(trips[0]).to.deep.equal({
            id: trips[0].id,
            user_id: 4,
            bike_id: 6,
            start_pos: [11.9721,57.70229],
            end_time: null,
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });

    });

    // add another assert to below to test bad start, good en dposition (add at the top)
    // add additional tests for checking user balance after each trip
    it('end a trip, ok', async () => {
        const conn = await db.pool.getConnection();

        let myTrip = await tripModel.start(5, 6);
        let sql = `
        UPDATE trip
        SET start_time = ?,
        start_pos = ?
        WHERE id = ?
        ;`;

        // backdate starttime of the trip
        let startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 15)
        let args = [startTime, JSON.stringify(points.ok_charge), myTrip.id];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        myTrip = await tripModel.end(5, myTrip.id);

        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);


        delete myTrip.end_time;
        delete myTrip.start_time;

        // high startcost and high park cost
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: 5,
            bike_id: 6,
            start_pos: points.ok_charge,
            end_pos: [11.9721,57.70229],
            start_cost: 10.00,
            var_cost: 15 * 3,
            park_cost: 100.00,
            total_cost: 155.00
        });

        myTrip = await tripModel.start(4, 6);
        sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;
        UPDATE bike
        SET coords = ?
        WHERE id = ?;`;

        // backdate starttime of the trip
        startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 33)
        args = [startTime, myTrip.id, JSON.stringify(points.ok_charge), 6];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        myTrip = await tripModel.end(4, myTrip.id);
        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);


        delete myTrip.end_time;
        delete myTrip.start_time;

        // low startcost because start in free parking and end in park_zone
        // low park cost because end in park zone
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: 4,
            bike_id: 6,
            start_pos: [11.9721,57.70229],
            end_pos: points.ok_charge,
            start_cost: 5.00,
            var_cost: 33 * 3,
            park_cost: 5.00,
            total_cost: 99.00 + 5.00 + 5.00
        });
    });


    it('end a trip, not ok - different user', async () => {

        let myTrip = await tripModel.start(5, 6);
        let secondTrip
        try {
            // bike 5 has status rented
            secondTrip = await tripModel.start(4, 6);
            throw new Error('Expected SqlError (No trip with id ', myTrip.id, ' found for user 5)');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('Cannot rent bike 6');
        }
        expect(secondTrip).to.be.an.undefined;
        // check that the trip has not been ended
        let trips = await tripModel.userTrips(5);

        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        delete trips[0].start_time;
        expect(trips.length).to.equal(1);
        expect(trips[0]).to.deep.equal({
            id: trips[0].id,
            user_id: 5,
            bike_id: 6,
            start_pos: [11.9721,57.70229],
            end_time: null,
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });
    });

    // Add test for:


    // 4. end a trip ok (check trip, check balance, different costs)
    // 4.2 test with different start zone and end zone combos
    // bad+bad, good+good, bad+good, good+bad
    // 5. end a trip, repeated request
    // 6. rent with different statuses, only 'available' should work
    // get all trips for a user
    // get all trips for a user paginated
});
