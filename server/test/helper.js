import { db } from "../src/models/db.js";
import { trips } from './dummy-data/trips.js'
// import { payments } from './dummy-data/payments.js'
import { zones } from './dummy-data/zones.js'
import { usersExt } from './dummy-data/users_ext.js'
import { bikes } from './dummy-data/bikes.js'



export const insertData = async function () {
    const conn = await db.pool.getConnection();

    let sql = `DELETE FROM trip;
        DELETE FROM payment;
        DELETE FROM user_card;
        DELETE FROM user;
        DELETE FROM bike;
        `;

    await conn.query(sql);

    const users = [];
    const cards = [];
    let allPaym = [];
    let allBikes = [];
    let allTrips = [...trips];
    try {
        await conn.beginTransaction();

        for (const bike of bikes) {
            const oldBikeId = bike.id;
            await conn.query(`INSERT INTO bike(city_id, status_id, charge_perc, coords, active)
            VALUES(?, ?, ?, ?, ?);`, [
                bike.city_id,
                bike.status_id,
                bike.charge_perc,
                bike.coords,
                bike.active
            ]);
            const id = await conn.query('SELECT MAX(id) AS last_id FROM bike;');
            bike.id = id[0].last_id;
            allBikes.push(bike);
            allTrips = allTrips.map((trip) => {
                if (trip.bike_id === oldBikeId) {
                    trip.bike_id = bike.id;
                }
                return trip;
            });
        }

        for (const elem of usersExt) {
            const user = elem.user;
            const oldUserId = user.id;
            const card = elem.card;
            let payments = elem.payments;

            await conn.query(`INSERT INTO user(email, balance, active)
             VALUES(?, ?, ?);`, [
                // elem.id,
                user.email,
                user.balance,
                user.active,
                user.amount
            ]);
            const id = await conn.query('SELECT MAX(id) AS last_id FROM user;');
            user.id = id[0].last_id;
            await conn.query(`INSERT INTO user_card
             VALUES(?, ?, ?);`, [
                user.id,
                card.card_nr,
                card.card_type
            ]);
            payments = payments.map((payment) => {
                payment.user_id = user.id;
                return payment;
            });
            users.push(user);
            cards.push(card);
            allPaym = [...allPaym, ...payments];
            allTrips = allTrips.map((trip) => {
                if (trip.user_id === oldUserId) {
                    trip.user_id = user.id
                }
                return trip;
            })
        }

        for (const elem of allPaym) {
            await conn.query(`INSERT INTO payment(user_id, date, ref, amount)
             VALUES(?, ?, ?, ?);`, [
                // elem.id,
                elem.user_id,
                elem.date,
                elem.ref,
                elem.amount
            ]);
            const id = await conn.query('SELECT MAX(id) AS last_id FROM payment;');
            elem.id = id[0].last_id;
        }

        for (const elem of allTrips) {
            await conn.query(`INSERT INTO trip(user_id, bike_id, start_time, end_time, start_pos, end_pos, start_cost, var_cost, park_cost)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
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
    return [users, cards, allPaym, allBikes, allTrips];
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
