import { db } from "../src/models/db.js";
import { trips } from './dummy-data/trips.js'
import { payments } from './dummy-data/payments.js'
import { zones } from './dummy-data/zones.js'



export const insertTrips = async function () {
    const conn = await db.pool.getConnection();
    try {
        await conn.beginTransaction();

        for (const elem of trips) {
            await conn.query(`INSERT INTO trip(user_id, bike_id, start_time, end_time, start_pos, end_pos, start_cost, var_cost, park_cost)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
                // elem.id,
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
            const id = await conn.query('SELECT MAX(id) AS last_id FROM trip');
            elem.id = id[0].last_id;
        }

        await conn.commit();

    } catch (err) {
        if (conn) {
            await conn.rollback();
        }
        throw err;
    } finally {
        if (conn) {
            await conn.end();
        }
    }
    return trips;
}

export const insertPayments = async function () {
    const conn = await db.pool.getConnection();
    try {
        await conn.beginTransaction();

        for (const elem of payments) {
            await conn.query(`INSERT INTO payment(user_id, date, ref, amount)
             VALUES(?, ?, ?, ?);`, [
                // elem.id,
                elem.user_id,
                new Date(elem.date),
                elem.ref,
                elem.amount
            ]);
            const id = await conn.query('SELECT MAX(id) AS last_id FROM payment;');
            elem.id = id[0].last_id;
            // console.log(elem);
        }

        await conn.commit();

    } catch (err) {
        if (conn) {
            await conn.rollback();
        }
        throw err;
    } finally {
        if (conn) {
            await conn.end();
        }
    }
    return payments;
}

export const insertZones = async function () {
    const conn = await db.pool.getConnection();
    try {
        await conn.beginTransaction();
        const descr = {
            1: "parking",
            2: "charging",
            3: "forbidden"
        }
        for (const zone of zones) {
            await conn.query(`INSERT INTO zone_loc(zone_id, city_id, date_from, geometry)
             VALUES(?, ?, ?, ?);`, [
                zone.zone_id, zone.city_id, zone.date_from, JSON.stringify(zone.geometry)
            ]);
            const id = await conn.query('SELECT MAX(id) AS last_id FROM zone_loc;');
            zone.id = id[0].last_id;
            zone.descr = descr[zone.zone_id];
            delete zone.date_from;
            if (zone.zone_id === 3) {
                zone.speed_limit = 0;
            }
        }

        await conn.commit();

    } catch (err) {
        if (conn) {
            await conn.rollback();
        }
        throw err;
    } finally {
        if (conn) {
            await conn.end();
        }
    }
    return zones;
}
