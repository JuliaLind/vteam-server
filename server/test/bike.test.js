/* global it describe */

import chai from 'chai';
import sinon from 'sinon';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import bikeModel from "../src/models/bike.js";





describe('bike model', () => {
    const bikes = [
        {
            id: 4,
            city_id: "STHLM",
            status_id: 4,
            status_descr: "available",
            charge_perc: 1.00,
            coords: JSON.stringify([18.01264,59.32601]),
            active: true,
        },
        {
            id: 5,
            city_id: "KRLST",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: JSON.stringify([11.95454,57.7244]),
            active: false,
        },
        {
            id: 6,
            city_id: "GBG",
            status_id: 1,
            status_descr: "maintenance required",
            charge_perc: 0.20,
            coords: JSON.stringify([11.9721,57.70229]),
            active: true,
        }
    ];
    beforeEach(async () => {
        let sql = `DELETE FROM bike;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO bike VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`
        let args = [
            bikes[0].id, bikes[0].city_id, bikes[0].status_id, bikes[0].charge_perc, bikes[0].coords, bikes[0].active,
            bikes[1].id, bikes[1].city_id, bikes[1].status_id, bikes[1].charge_perc, bikes[1].coords, bikes[1].active,
            bikes[2].id, bikes[2].city_id, bikes[2].status_id, bikes[2].charge_perc, bikes[2].coords, bikes[2].active

        ];
        await conn.query(sql, args);
        if (conn) conn.end();
    });
    afterEach(() => {
        sinon.restore();
    });
    it('extracting one bike. Show return regardless of active or inactive', async () => {
        let bike = await bikeModel.getOne(5)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });
        bike = await bikeModel.getOne(4)

        expect(bike).to.deep.equal({
            id: 4,
            city_id: "STHLM",
            status_id: 4,
            status_descr: "maintenance required",
            charge_perc: 1,
            coords: [18.01264,59.32601],
            active: true,
        });
        bike = await bikeModel.getOne(6)

        expect(bike).to.deep.equal({
            id: 6,
            city_id: "GBG",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.2,
            coords: [11.9721,57.70229],
            active: true,
        });
    });

    it('activate an active bike och activate an already active bike. Both should work', async () => {
        let bike = await bikeModel.activate(5)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: true,
        });
        bike = await bikeModel.activate(4)

        expect(bike).to.deep.equal({
            id: 4,
            city_id: "STHLM",
            status_id: 4,
            status_descr: "maintenance required",
            charge_perc: 1,
            coords: [18.01264,59.32601],
            active: true,
        });
        bike = await bikeModel.getOne(6)
    });

    it('deactivate an active or inactive bike, no ongoing trip. Both should work', async () => {
        let bike = await bikeModel.deactivate(5)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });
        bike = await bikeModel.deactivate(4)

        expect(bike).to.deep.equal({
            id: 4,
            city_id: "STHLM",
            status_id: 4,
            status_descr: "maintenance required",
            charge_perc: 1,
            coords: [18.01264,59.32601],
            active: false,
        });
        bike = await bikeModel.getOne(6)
    });

    it('returns all possible bike statuses', async () => {
        const statuses = await bikeModel.statuses()

        expect(statuses).to.deep.equal([
            {
                "id": 1,
                "descr": "available"
            },
            {
                "id": 2,
                "descr": "rented"
            },
            {
                "id": 3,
                "descr": "in maintenance"
            },
            {
                "id": 4,
                "descr": "maintenance required"
            }
        ]);
    });

    // add test for
    // 1. deactivate when active trip)

});
