import { db } from "./db.js"


const trip = {
    /**
     * Sets bike's status_id to 2-rented.
     * Starts a new trip and returns
     * an object with: id (id of the
     * trip to be used for ending the
     * trip), user_id, bike_id,
     * start_time, stat_pos
     * @param {Number} userId 
     * @param {Number} bikeId 
     * @returns {Promise<Object>}
     */
    start: async function(userId, bikeId) {
        const result = await db.queryWithArgs(`CALL start_trip(?, ?);`, [userId, bikeId]);
        const trip = result[0][0];


        trip.start_pos = JSON.parse(trip.start_pos);
        return trip;
    },
    /**
     * Ends a trip, returns the complete trip
     * object with all fields + total cost for
     * the trip:
     * id, user_id, bike_id, start_time, end_time,
     * start_pos, end_pos, start_cost, var_cost,
     * park_cost, total_cost
     * @param {Number} userId 
     * @param {Number} tripId 
     * @returns {Promise<Object>}
     */
    end: async function(userId, tripId) {
        const result = await db.queryWithArgs(`CALL end_trip(?, ?);`, [userId, tripId]);

        const trip = result[0][0];
        // return trip;
        return this.adjTypes(trip);
    },
    /**
     * All attributes come out from the
     * database as either int or string,
     * this method converts the attributes
     * to their correct types
     * @param {Object} tripObj 
     * @returns {Object}
     */
    adjTypes(tripObj){
        const updated = {
            ...tripObj
        };
        updated.start_pos = JSON.parse(tripObj.start_pos);
        updated.end_pos ? updated.end_pos = JSON.parse(updated.end_pos) : undefined;
        updated.start_cost ? updated.start_cost = parseFloat(updated.start_cost) : undefined;
        updated.start_cost ? updated.start_cost = parseFloat(updated.start_cost) : undefined;
        updated.var_cost ? updated.var_cost = parseFloat(updated.var_cost) : undefined;
        updated.park_cost ? updated.park_cost = parseFloat(updated.park_cost) : undefined;
        updated.total_cost ? updated.total_cost = parseFloat(updated.total_cost) : undefined;

        return updated;
    },
    /**
     * Returns all trips for a user, latest
     * one first. Includes any ongoing trip
     * @param {Number} userId 
     * @returns {Promise<Array>}
     */
    userTrips: async function(userId) {
        const result = await db.queryWithArgs(`CALL user_trips(?);`, [userId]);
        const trips = result[0].map((trip) => {
            return this.adjTypes(trip);
        });

        return trips;
    },
    /**
     * Returns an array of all trips, latest
     * one first. Including ongoing trips
     * @returns {Promise<Array>}
     */
    allTrips: async function() {
        const result = await db.queryNoArgs(`CALL all_trips();`);
        const trips = result[0].map((trip) => {
            return this.adjTypes(trip);
        });

        return trips;
    },
    /**
     * Returns a user's
     * trips in an interval
     * created with offset and limit
     * @param {Number} userId
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Promise<Array>}
     */
    userTripsPag: async function(userId, offset, limit) {
        const result = await db.queryWithArgs(`CALL user_trips_pag(?, ?, ?);`, [userId, offset, limit]);
        const trips = result[0].map((trip) => {
            return this.adjTypes(trip);
        });

        return trips;
    },
    /**
     * Returns all trips in an interval,
     * starting with the first row after offset
     * and returns number of rows up to the
     * limit. For example offset 2 limit 4
     * would return rows 3, 4, 5, 6 provided
     * there are at least 6 rows
     * @param {Number} offset 
     * @param {Number} limit 
     * @returns {Promise<Array>}
     */
    allTripsPag: async function(offset, limit) {
        const result = await db.queryWithArgs(`CALL all_trips_pag(?, ?);`, [offset, limit]);
        const trips = result[0].map((trip) => {
            return this.adjTypes(trip);
        });

        return trips;
    },
};

export default trip;
