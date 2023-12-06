import { db } from "./db.js"


const trip = {
    /**
     * 
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
     * 
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
    adjTypes(tripObj){
        const updated = {
            ...tripObj
        };
        console.log("im updated", updated);
        updated.start_pos = JSON.parse(tripObj.start_pos);
        updated.end_pos ? updated.end_pos = JSON.parse(updated.end_pos) : undefined;
        updated.start_cost ? updated.start_cost = parseFloat(updated.start_cost) : undefined;
        updated.start_cost ? updated.start_cost = parseFloat(updated.start_cost) : undefined;
        updated.var_cost ? updated.var_cost = parseFloat(updated.var_cost) : undefined;
        updated.park_cost ? updated.park_cost = parseFloat(updated.park_cost) : undefined;
        updated.total_cost ? updated.total_cost = parseFloat(updated.total_cost) : undefined;

        return updated;
    },
    userTrips: async function(userId) {
        const result = await db.queryWithArgs(`CALL user_trips(?);`, [userId]);
        const trips = result[0].map((trip) => {
            return this.adjTypes(trip);
        });

        return trips;
    }

};

export default trip;
