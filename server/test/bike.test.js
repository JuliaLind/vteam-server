/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import bikeModel from "../src/models/bike.js";
import { bikes } from './dummy-data/bikes.js'





describe('bike model', () => {
    beforeEach(async () => {
        let sql = `DELETE FROM bike;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO bike VALUES(?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?, ?);`

        let args = [];
        for (const bike of bikes) {
            args = args.concat([bike.id, bike.city_id, bike.status_id, bike.charge_perc, bike.coords, bike.active,])
        }

        await conn.query(sql, args);
        if (conn) conn.end();
    });
    it('Update a bike to valid values', async () => {
        await bikeModel.updateBike(
            5,
            4,
            0.60,
            [18.999,59.999]
        );
        let bike = await bikeModel.getOne(5)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 4,
            status_descr: "maintenance required",
            charge_perc: 0.60,
            coords: [18.999,59.999],
            active: false,
        });

    });

    it("update bike to invalid values should not work", async () => {
        try {
            // try invalid status
            await bikeModel.updateBike(5, 5, 0.6, [18.999,59.999]);
            throw new Error('Expected SqlError (foreign key constraint violation)');
        } catch (error) {
            expect(error.sqlState).to.equal('23000');
            expect(error.message).to.include('foreign key constraint');
        }
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
        try {
            // try invalid charge range too high
            await bikeModel.updateBike(5, 1, 1.1, [18.999,59.999]);

            throw new Error('Expected a custom out of range error of charge perc');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('The charge percentage should be a value between 0.00 - 1.00');
        }
        await bikeModel.getOne(5)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });
        try {
            // try invalid charge range too high
            await bikeModel.updateBike(5, 5, -0.1, [18.999,59.999]);

            throw new Error('Expected a custom out of range error of charge perc');
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include('The charge percentage should be a value between 0.00 - 1.00');
        }
        await bikeModel.getOne(5)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });
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

    it('get all regardless of active or inactive', async () => {
        let bikes = await bikeModel.getAll()

        expect(bikes).to.deep.equal([
            {
                id: 4,
                city_id: "STHLM",
                status_id: 4,
                status_descr: "maintenance required",
                charge_perc: 1,
                coords: [18.01264,59.32601],
                active: true,
            },
            {
                id: 5,
                city_id: "KRLST",
                status_id: 1,
                status_descr: "available",
                charge_perc: 0.70,
                coords: [11.95454,57.7244],
                active: false,
            },
            {
                id: 6,
                city_id: "GBG",
                status_id: 1,
                status_descr: "available",
                charge_perc: 0.2,
                coords: [11.9721,57.70229],
                active: true,
            }
        ]);
    });

    it('get only available bikes in a city', async () => {
        let bikes = await bikeModel.getAllInCity("GBG")

        expect(bikes).to.deep.equal([
            {
                id: 6,
                city_id: "GBG",
                status_id: 1,
                status_descr: "available",
                charge_perc: 0.2,
                coords: [11.9721,57.70229],
                active: true,
            }
        ]);

        bikes = await bikeModel.getAllInCity("STHLM")

        expect(bikes).to.deep.equal([{
            id: 4,
            city_id: "STHLM",
            status_id: 4,
            status_descr: "maintenance required",
            charge_perc: 1,
            coords: [18.01264,59.32601],
            active: true,
        }]);
    });

    it('get all bikes in a city', async () => {
        let bikes = await bikeModel.getAvail("GBG")

        expect(bikes).to.deep.equal([
            {
                id: 6,
                city_id: "GBG",
                status_id: 1,
                status_descr: "available",
                charge_perc: 0.2,
                coords: [11.9721,57.70229],
                active: true,
            }
        ]);

        bikes = await bikeModel.getAvail("STHLM")

        expect(bikes).to.deep.equal([]);
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

    it("updates a bike's status to a valid status", async () => {
        let bike = await bikeModel.updStatus(5,3)

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 3,
            status_descr: "in maintenance",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });

        bike = await bikeModel.updStatus(5,4)
        expect(bike).to.deep.equal({
            id: 5,
            city_id: "KRLST",
            status_id: 4,
            status_descr: "maintenance required",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });
    });

    it("should not be able to update to non-existsent status", async () => {
        try {
            // there are only statuses 1-4
            await bikeModel.updStatus(5, 5);

            throw new Error('Expected SqlError (foreign key constraint violation)');
            } catch (error) {
                expect(error.sqlState).to.equal('23000');
                expect(error.message).to.include('foreign key constraint');
        }
    });

    
    it("updates a bike's city to a valid city", async () => {
        let bike = await bikeModel.updCity(5, "GBG")

        expect(bike).to.deep.equal({
            id: 5,
            city_id: "GBG",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });

        bike = await bikeModel.updCity(5,"STHLM")
        expect(bike).to.deep.equal({
            id: 5,
            city_id: "STHLM",
            status_id: 1,
            status_descr: "available",
            charge_perc: 0.70,
            coords: [11.95454,57.7244],
            active: false,
        });
    });

    
    it("should not be able to update to non-existsent city", async () => {
        try {
            // MALM is not in the system
            await bikeModel.updCity(5, "MALM");

            throw new Error('Expected SqlError (foreign key constraint violation)');
            } catch (error) {
                expect(error.sqlState).to.equal('23000');
                expect(error.message).to.include('foreign key constraint');
        }
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
    // 1. deactivate when active trip, check that trip has ended

});
