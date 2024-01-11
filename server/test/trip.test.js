/* global it describe beforeEach after */

import chai from 'chai';

chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import bikeModel from "../src/models/bike.js";
import tripModel from "../src/models/trip.js";
import { zones, points } from './dummy-data/zones.js';
import { insertData } from './helper.js';


describe('trip model', () => {
    let users;
    let bikes;

    beforeEach(async () => {
        const conn = await db.pool.getConnection();

        const sql = `
        DELETE FROM zone_loc_removed;
        DELETE FROM zone_loc;
        INSERT INTO zone_loc
        VALUES(?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?);`;

        let args = [];

        for (const zone of zones) {
            args = args.concat([zone.id, zone.zone_id, zone.city_id, zone.date_from, JSON.stringify(zone.geometry)]);
        }

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        const res = await insertData();
        users = res.users;
        bikes = res.bikes;
    });
    after(async () => {
        const conn = await db.pool.getConnection();
        const sql = `DELETE FROM trip;
        DELETE FROM zone_loc_removed;
        DELETE FROM zone_loc;`;
        await conn.query(sql);
        if (conn) {
            conn.end();
        }
    })
    it('starts a trip, ok', async () => {
        const userid = users[0].id;
        const bikeid = bikes[2].id;
        const trip = await tripModel.start(userid, bikeid);

        expect(Math.abs(new Date - trip.start_time)/1000).to.be.lessThan(1);
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;
        delete trip.start_time;
        expect(trip).to.deep.equal({
            id: trip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
        })


        const trips = await tripModel.userTrips(userid);

        expect(trips.length).to.equal(1);
        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        delete trips[0].start_time;
        expect(trips[0]).to.deep.equal({
            id: trip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_time: null,
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });
    });

    it('cannot start a trip because bike inactive', async () => {
        let trip;
        const bikeid = bikes[1].id;
        const userid = users[0].id;

        try {
            // bike 5 has active = false
            trip = await tripModel.start(userid, bikeid);
            throw new Error(`Expected SqlError (Cannot rent bike ${bikeid})`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`Cannot rent bike ${bikeid}`);
        }
        expect(trip).to.be.an.undefined;
        const trips = await tripModel.userTrips(userid);
        expect(trips.length).to.equal(0);
        const isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.false;
    });
    it('cannot start a trip because bike has status "maintenance required"', async () => {
        let trip;
        const userid = users[2].id;
        const bikeid = bikes[0].id
        try {
            trip = await tripModel.start(userid, bikeid);
            throw new Error(`Expected SqlError (Cannot rent bike ${bikeid})`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`Cannot rent bike ${bikeid}`);
        }
        expect(trip).to.be.an.undefined;
        const trips = await tripModel.userTrips(userid);
        expect(trips.length).to.equal(7);
        const isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.false;
    });

    it('cannot start a trip because bike has status "in maintenance"', async () => {
        const conn = await db.pool.getConnection();
        const sql = `
        UPDATE bike
        SET status_id = ?
        WHERE id = ?;
        ;`

        const bikeid = bikes[0].id
        const userid = users[2].id
        // backdate starttime of the trip and start position to charge zone
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 49)
        const args = [3, bikeid];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        let trip;

        try {
            trip = await tripModel.start(userid, bikeid);
            throw new Error(`Expected SqlError (Cannot rent bike ${bikeid})`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`Cannot rent bike ${bikeid}`);
        }
        expect(trip).to.be.an.undefined;
        const trips = await tripModel.userTrips(userid);

        expect(trips.length).to.equal(7);
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.false;
    });

    it('cannot start a trip again because bike has status "rented", same error even if user same', async () => {
        const bikeid = bikes[2].id
        const userid = users[0].id

        await tripModel.start(userid, bikeid);
        let secondTrip;

        try {
            // bike 5 has status rented
            secondTrip = await tripModel.start(userid, bikeid);
            throw new Error(`Expected SqlError (Cannot rent bike ${bikeid})`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`Cannot rent bike ${bikeid}`);
        }
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;
        expect(secondTrip).to.be.an.undefined;
        const trips = await tripModel.userTrips(userid);

        expect(trips.length).to.equal(1);
        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        delete trips[0].start_time;

        // check that no changes were done to the trip initiated by first user
        expect(trips[0]).to.deep.equal({
            id: trips[0].id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_time: null,
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });
    });

    it('end a trip, start in charge and end in bad parking = high start cost, high park cost', async () => {
        const bikeid = bikes[2].id
        const userid = users[1].id
        let myTrip = await tripModel.start(userid, bikeid);
        let conn = await db.pool.getConnection();

        let sql = `
        UPDATE trip
        SET start_time = ?,
        start_pos = ?
        WHERE id = ?
        ;`;

        // backdate starttime of the trip and strt position to charge zone
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 15)
        let args = [startTime, JSON.stringify(points.ok_charge), myTrip.id];

        await conn.query(sql, args);

        sql = `
        SELECT status_id
        FROM bike
        WHERE id = ?
        ;`;

        args = [bikeid];
        let bikeStatus = await conn.query(sql, args);


        if (conn) {
            conn.end();
        }

        expect(bikeStatus[0].status_id).to.equal(2);
        let isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.true;
        myTrip = await tripModel.end(userid, myTrip.id);

        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);


        delete myTrip.end_time;
        delete myTrip.start_time;

        isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.false;
        // high startcost and high park cost,
        // because start in park zone and end in free parking
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: points.ok_charge,
            end_pos: [11.9721,57.70229],
            start_cost: 10.00,
            var_cost: 15 * 3,
            park_cost: 100.00,
            total_cost: 155.00
        });

        conn = await db.pool.getConnection();

        sql = `
        SELECT status_id
        FROM bike
        WHERE id = ?
        ;`;

        args = [bikeid];

        bikeStatus = await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        expect(bikeStatus[0].status_id).to.equal(1);
    });

    it('test that rented maintenance required is changed to maintenance required status_id when trip is ended', async () => {
        const bikeid = bikes[2].id;
        const userid = users[1].id;
        let myTrip = await tripModel.start(userid, bikeid);
        let conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?,
        start_pos = ?
        WHERE id = ?
        ;`;

        // backdate starttime of the trip and strt position to charge zone
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 15)
        let args = [startTime, JSON.stringify(points.ok_charge), myTrip.id];

        await conn.query(sql, args);

        sql = `
        SELECT status_id
        FROM bike
        WHERE id = ?
        ;`;

        args = [bikeid];
        let bikeStatus = await conn.query(sql, args);


        if (conn) {
            conn.end();
        }

        expect(bikeStatus[0].status_id).to.equal(2);
        let isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.true;

        conn = await db.pool.getConnection();
        sql = `
        UPDATE bike
        SET status_id = ?
        WHERE id = ?;`

        // new status_id 4 maintenance required
        args = [5, bikeid];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }


        isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.true;

        myTrip = await tripModel.end(userid, myTrip.id);

        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);


        delete myTrip.end_time;
        delete myTrip.start_time;

        isRented = await bikeModel.isRented(6);
        expect(isRented).to.be.false;
        // high startcost and high park cost,
        // because start in park zone and end in free parking
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: points.ok_charge,
            end_pos: [11.9721,57.70229],
            start_cost: 10.00,
            var_cost: 15 * 3,
            park_cost: 100.00,
            total_cost: 155.00
        });

        conn = await db.pool.getConnection();

        sql = `
        SELECT status_id
        FROM bike
        WHERE id = ?
        ;`;

        args = [bikeid];

        bikeStatus = await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        expect(bikeStatus[0].status_id).to.equal(4);
    });
    it('end a trip, start in park zone and end in park zone = high start cost and low park cost', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let conn = await db.pool.getConnection();
        let sql = `
        UPDATE bike
        SET coords = ?
        WHERE id = ?;`
        let args = [JSON.stringify(points.ok_park), bikeid];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        let myTrip = await tripModel.start(userid, bikeid);
        conn = await db.pool.getConnection();
        sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;
        ;`

        // backdate starttime of the trip and start position to charge zone
        let startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 49);
        args = [startTime, myTrip.id];



        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        let isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;
        myTrip = await tripModel.end(userid, myTrip.id);
        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);

        isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.false;
        delete myTrip.end_time;
        delete myTrip.start_time;

        // hight startcost  and high park cost
        // because start in free parking and
        // because end in fee parking
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: points.ok_park,
            end_pos: points.ok_park,
            start_cost: 10.00,
            var_cost: 49 * 3,
            park_cost: 5.00,
            total_cost: 49 * 3.00 + 10.00 + 5.00
        });
    });

    it('end a trip, high startcost and high park cost', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let myTrip = await tripModel.start(userid, bikeid);
        let conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;
        ;`

        // backdate starttime of the trip and start position to charge zone
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 49);
        let args = [startTime, myTrip.id];


        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        let isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.true;
        myTrip = await tripModel.end(userid, myTrip.id);
        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);

        isRented = await bikeModel.isRented(bikeid);
        expect(isRented).to.be.false;
        delete myTrip.end_time;
        delete myTrip.start_time;

        // hight startcost  and high park cost
        // because start in free parking and
        // because end in fee parking
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_pos: [11.9721,57.70229],
            start_cost: 10.00,
            var_cost: 49 * 3,
            park_cost: 100.00,
            total_cost: 49 * 3.00 + 10.00 + 100.00
        });
    });

    it('end a trip, start in bad parking end in charge zone = low start cost and low park cost', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        const conn = await db.pool.getConnection();

        let myTrip = await tripModel.start(userid, bikeid);
        let sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;
        UPDATE bike
        SET coords = ?
        WHERE id = ?;`

        // backdate starttime of the trip and start position to charge zone
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 33);
        let args = [startTime, myTrip.id, JSON.stringify(points.ok_charge), bikeid];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        myTrip = await tripModel.end(userid, myTrip.id);
        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);


        delete myTrip.end_time;
        delete myTrip.start_time;

        // low startcost  and low park cost
        // because start in free parking and
        // because end in charge zone
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_pos: points.ok_charge,
            start_cost: 5.00,
            var_cost: 33 * 3.00,
            park_cost: 5.00,
            total_cost: 99.00 + 5.00 + 5.00
        });
    });

    it('end a trip, start in bad parking end in park zone = low start cost and low park cost', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let myTrip = await tripModel.start(userid, bikeid);
        const conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;
        UPDATE bike
        SET coords = ?
        WHERE id = ?;`

        // backdate starttime of the trip and start position to park zone
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 28);
        let args = [startTime, myTrip.id, JSON.stringify(points.ok_park), bikeid];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        myTrip = await tripModel.end(userid, myTrip.id);
        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);


        delete myTrip.end_time;
        delete myTrip.start_time;

        // low startcost  and low park cost
        // because start in free parking and
        // because end in charge zone
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_pos: points.ok_park,
            start_cost: 5.00,
            var_cost: 28 * 3,
            park_cost: 5.00,
            total_cost: 28.00 * 3 + 5.00 + 5.00
        });
    });

    it('end a trip, start in bad parking end in bad parking = high start cost and high park cost', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let myTrip = await tripModel.start(userid, bikeid);

        const conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;`

        // backdate starttime of the trip 
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 14);
        let args = [startTime, myTrip.id];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        myTrip = await tripModel.end(userid, myTrip.id);
        expect(Math.abs(new Date - myTrip.end_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);
        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);

        delete myTrip.end_time;
        delete myTrip.start_time;

        // hight startcost  and high park cost
        // because start in free parking and
        // because end in fee parking
        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_pos: [11.9721,57.70229],
            start_cost: 10.00,
            var_cost: 14 * 3,
            park_cost: 100.00,
            total_cost: 14.00 * 3 + 10.00 +100.00
        });
    });
    it('trip should end when bike is deactivated', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let myTrip = await tripModel.start(userid, bikeid);

        const conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;`

        // backdate starttime of the trip 
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 14);
        let args = [startTime, myTrip.id];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        let data = await bikeModel.deactivate(bikeid);
        let bike = data.bike;
        myTrip = data.trip;


        expect(Math.abs(startTime - myTrip.start_time)/1000).to.be.lessThan(1);

        delete myTrip.end_time;
        delete myTrip.start_time;

        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [ 11.9721,57.70229 ],
            end_pos: [ 11.9721,57.70229 ],
            start_cost: 10.00,
            var_cost: 14.00 * 3,
            park_cost: 100.00,
            total_cost: 14.00 * 3 + 10.00 + 100.00
        });

        expect(bike).to.deep.equal(
            {
                id: bikeid,
                city_id: "GBG",
                status_id: 1,
                status_descr: "available",
                charge_perc: 0.2,
                coords: [ 11.9721,57.70229 ],
                active: false,
            }
        );
    });

    it('trip should end when charge_perc is at 3%', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let myTrip = await tripModel.start(userid, bikeid);

        const conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?
        WHERE id = ?;`

        // backdate starttime of the trip 
        let startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 14);
        let args = [startTime, myTrip.id];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        let endedTrip = await bikeModel.updateBike(bikeid, 2, 0.03, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");

        expect(Math.abs(startTime - endedTrip.start_time)/1000).to.be.lessThan(1);

        delete endedTrip.end_time;
        delete endedTrip.start_time;

        expect(endedTrip).to.deep.equal({
            id: endedTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [ 11.9721,57.70229 ],
            end_pos: [ 11.3456,57.1123 ],
            start_cost: 10.00,
            var_cost: 14.00 * 3,
            park_cost: 100.00,
            total_cost: 14.00 * 3 + 10.00 + 100.00
        });
    });
    it('trip should end when charge_perc is below 3%', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        const conn = await db.pool.getConnection();
        let sql = `
        UPDATE bike
        SET charge_perc = ?
        WHERE id = ?
        ;`;

        let args = [0.04, bikeid];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        await tripModel.start(userid, bikeid);

        const endedTrip = await bikeModel.updateBike(bikeid, 2, 0.02, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");

        expect(Math.abs(new Date() - endedTrip.end_time)/1000).to.be.lessThan(1);

        delete endedTrip.end_time;
        delete endedTrip.start_time;

        expect(endedTrip).to.deep.equal({
            id: endedTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [ 11.9721,57.70229 ],
            end_pos: [ 11.3456,57.1123 ],
            start_cost: 10.00,
            var_cost: 0,
            park_cost: 100.00,
            total_cost: 0 + 10.00 + 100.00
        });
    });

    it('trip should not end when charge_perc is above 3%', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        let myTrip = await tripModel.start(userid, bikeid);

        let endedTrip = await bikeModel.updateBike(bikeid, 2, 0.04, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");

        expect(endedTrip).to.be.undefined;

        const conn = await db.pool.getConnection();
        let sql = `
        SELECT * FROM v_trip
        WHERE id = ?
        ;`;

        let args = [myTrip.id];

        const data = await conn.query(sql, args);
        myTrip = data[0];
        if (conn) {
            conn.end();
        }


        expect(Math.abs(new Date() - myTrip.start_time)/1000).to.be.lessThan(1);
        delete myTrip.start_time;

        expect(myTrip).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            end_time: null,
            start_pos: JSON.stringify([11.9721,57.70229]),
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });
    });
    it('end a trip, not ok - different user', async () => {

        const bikeid = bikes[2].id;
        const userid = users[1].id;
        const userid2 = users[0].id;

        await tripModel.start(userid, bikeid);
        let secondTrip;

        try {
            secondTrip = await tripModel.start(userid2, bikeid);
            throw new Error(`Expected SqlError (Cannot rent bike ${bikeid})`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`Cannot rent bike ${bikeid}`);
        }
        expect(secondTrip).to.be.an.undefined;
        // check that the trip has not been ended
        let trips = await tripModel.userTrips(userid);

        expect(Math.abs(new Date - trips[0].start_time)/1000).to.be.lessThan(1);
        delete trips[0].start_time;
        expect(trips.length).to.equal(6);
        expect(trips[0]).to.deep.equal({
            id: trips[0].id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [11.9721,57.70229],
            end_time: null,
            end_pos: null,
            start_cost: null,
            var_cost: null,
            park_cost: null,
            total_cost: null
        });
    });

    it('start a trip, not ok - no card registered', async () => {
        const conn = await db.pool.getConnection();
        let sql = `
        INSERT INTO user(email)
             VALUES(?);
        SELECT MAX(id) AS last_id FROM user;`;

        let args = ["user_with@no.card"];

        const data = await conn.query(sql, args);
        const userid = data[0].last_id;

        if (conn) {
            conn.end();
        }

        const bikeid = bikes[2].id;

        let myTrip;
        try {
            myTrip = await tripModel.start(userid, bikeid);
            throw new Error(`Expected SqlError (No payment card registered)`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`No payment card registered`);
        }
        expect(myTrip).to.be.an.undefined;
        const trips = await tripModel.userTrips(userid);
        expect(trips.length).to.equal(0);
        const check = await bikeModel.isRented(bikeid);
        expect(check).to.be.false;
    });

    it('ending trip twice will not change the values', async () => {
        const userid = users[0].id;
        const bikeid = bikes[2].id;
        let myTrip = await tripModel.start(userid, bikeid);
        await tripModel.end(userid, myTrip.id);

        const conn = await db.pool.getConnection();
        let sql = `
        UPDATE trip
        SET start_time = ?,
        end_time = ?,
        var_cost = ?
        WHERE id = ?;`;

        // backdate starttime and endtime of the trip 
        const startTime = new Date();
        startTime.setMinutes(startTime.getMinutes() - 20 - 14);
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() - 20);
        let args = [startTime, endTime, 18 * 3, myTrip.id];

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        const latest = await tripModel.end(userid, myTrip.id);

        expect(Math.abs(startTime - latest.start_time)/1000).to.be.lessThan(1);
        expect(Math.abs(endTime - latest.end_time)/1000).to.be.lessThan(1);

        delete latest.end_time;
        delete latest.start_time;

        expect(latest).to.deep.equal({
            id: myTrip.id,
            user_id: userid,
            bike_id: bikeid,
            start_pos: [ 11.9721,57.70229 ],
            end_pos: [ 11.9721,57.70229 ],
            start_cost: 10.00,
            var_cost: 18.00 * 3,
            park_cost: 100.00,
            total_cost: 18.00 * 3 + 10.00 + 100.00
        });
    });
    it('bike updates status 2->5 ok', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;

        await tripModel.start(userid, bikeid);

        await bikeModel.updateBike(bikeid, 5, 0.8, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(5);
        expect(bikeData.charge_perc).to.equal(0.8);
    });
    it('bike updates status 2->4 not ok', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        await tripModel.start(userid, bikeid);

        await bikeModel.updateBike(bikeid, 4, 0.8, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(2);
        expect(bikeData.charge_perc).to.equal(0.8);
    });
    it('bike updates status 1->4 ok', async () => {
        const bikeid = bikes[2].id;

        await bikeModel.updateBike(bikeid, 4, 0.8, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(4);
        expect(bikeData.charge_perc).to.equal(0.8);
    });
    it('bike updates status 1->5 not ok', async () => {
        const bikeid = bikes[2].id;

        await bikeModel.updateBike(bikeid, 5, 0.8, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(1);
        expect(bikeData.charge_perc).to.equal(0.8);
    });
    it('bike updates status 1->2 not ok', async () => {
        const bikeid = bikes[2].id;

        await bikeModel.updateBike(bikeid, 2, 0.8, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.false;

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(1);
        expect(bikeData.charge_perc).to.equal(0.8);
    });
    it('bike updates status 2->1 not ok', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;
        await tripModel.start(userid, bikeid);

        await bikeModel.updateBike(bikeid, 1, 0.8, [ 11.3456,57.1123 ], "ee54283c18caea5a49abd8328258d2dd");
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(2);
        expect(bikeData.charge_perc).to.equal(0.8);
    });
    it('admin updates status during ongoing trip not ok', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;

        await tripModel.start(userid, bikeid);

        await bikeModel.updStatus(bikeid, 4);
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(2);
    });
    it('admin cannot update to status 5', async () => {
        const bikeid = bikes[2].id;
        const userid = users[0].id;

        await tripModel.start(userid, bikeid);

        await bikeModel.updStatus(bikeid, 5);
        const isRented = await bikeModel.isRented(bikeid);

        expect(isRented).to.be.true;

        const bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(2);
    });

    it('admin update status 1->4 and 4->1 ok', async () => {
        const bikeid = bikes[2].id;

        await bikeModel.updStatus(bikeid, 4);

        let bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(4);

        await bikeModel.updStatus(bikeid, 1);

        bikeData = await bikeModel.getOne(bikeid);
        expect(bikeData.status_id).to.equal(1);
    });
});
