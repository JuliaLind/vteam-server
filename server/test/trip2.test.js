/* global it describe beforeEach after */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import tripModel from "../src/models/trip.js";
import { bikes } from './dummy-data/bikes.js'
import { users } from './dummy-data/users.js'
import { trips } from './dummy-data/trips.js'
const dataAdj = trips.reverse().map((elem) => {
    delete elem.id;
    return elem;
})

async function insertData() {
    const conn = await db.pool.getConnection();
    let sql = `DELETE FROM trip;
        DELETE FROM user;
        DELETE FROM bike;
        INSERT INTO bike VALUES(?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?);
        INSERT INTO user VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);
        INSERT INTO trip VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        let args = [];

    for (const bike of bikes) {
        args = args.concat([bike.id, bike.city_id, bike.status_id, bike.charge_perc, bike.coords, bike.active])
    }
    for (const user of users) {
        args = args.concat([user.id, user.email, user.card, user.card_type, user.balance, user.active]);
    }
    for (const elem of trips) {
        args = args.concat([
            elem.id,
            elem.user_id,
            elem.bike_id,
            elem.start_time,
            elem.end_time,
            JSON.stringify(elem.start_pos),
            JSON.stringify(elem.end_pos),
            elem.start_cost,
            elem.var_cost,
            elem.park_cost
        ]);
    }


    await conn.query(sql, args);
    if (conn) {
        conn.end();
    }

}

describe('trip model part 2', () => {
    beforeEach(async () => {
        await insertData();
    });
    after(async () => {
        const conn = await db.pool.getConnection();

        let sql = `DELETE FROM trip;
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

    //     delete trips[0].start_time;
    //     expect(trips[0]).to.deep.equal({
    //         id: trip.id,
    //         user_id: 4,
    //         bike_id: 6,
    //         start_pos: [11.9721,57.70229],
    //         end_time: null,
    //         end_pos: null,
    //         start_cost: null,
    //         var_cost: null,
    //         park_cost: null,
    //         total_cost: null
    //     });


    //     expect(trips[0].end_time).to.be.null;
    //     expect(trips[0].end_pos).to.be.null;
    //     expect(trips[0].start_pos).to.deep.equal([11.9721,57.70229]);
    //     expect(trips[0].start_cost).to.be.null;
    //     expect(trips[0].var_cost).to.be.null;
    //     expect(trips[0].park_cost).to.be.null;

    });
});

