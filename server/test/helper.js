import { db } from "../src/models/db.js";
import { trips } from './dummy-data/trips.js'


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
