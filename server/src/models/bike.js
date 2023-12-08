import { db } from "./db.js"
import tripModel from "./trip.js"


const bike = {
    /**
     * All params except integers
     * are returned from DB as wrong type,
     * mostly as string values.
     * This function converts those
     * attributes to correct types
     * @param {Object} bikeObj 
     * @returns the bike object with type-corrected
     * attributes
     */
    adjTypes(bikeObj) {
        return {
            id: bikeObj.id,
            city_id: bikeObj.city_id,
            status_id: bikeObj.status_id,
            status_descr: bikeObj.status_descr,
            charge_perc: parseFloat(bikeObj.charge_perc),
            coords: JSON.parse(bikeObj.coords),
            active: bikeObj.active === 1,
        };
    },
    /**
     * Returns true if the bike has an
     * ongoing trip, otherwise returns
     * false
     * @param {Number} bikeId
     * @returns {Promise<Boolean>}
     */
    isRented: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL is_rented(?);`, [bikeId]);
        if (result[0][0]) {
            return true;
        }
        return false;
    },
    /**
     * To be used by admin for deactivating
     * a bike. Deactivating a bike
     * changes the value of active from
     * true to false. Any ongoing trip
     * will be ended. The status_id of
     * the bike will only be
     * changed if current status is
     * rented -> in this case it will
     * be changed to 1 - available.
     * 
     * Returns a object with a bike
     * object: id, city_id, status_id,
     * status_descr, charge_perc (0.00-1.00),
     * coords (array<float>) and active
     * (bool). If an ongoing trip
     * was ended, also the trip-object:
     * 
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    deactivate: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL deactivate(?);`, [bikeId]);
        // if there is a trip db query returns
        // a resultset of three elements
        if (result.length > 2) {
            return {
                bike: this.adjTypes(result[1][0]),
                trip: tripModel.adjTypes(result[0][0])
            };
        }
        // if there is no ongoing trip the
        // resultset from db contains two elements
        return {
            bike: this.adjTypes(result[0][0])
        };
    },
    /**
     * Changes a bikes active attribute
     * to true and returns a bike-object:
     * id, city_id, status_id,
     * status_descr, charge_perc (0.00-1.00),
     * coords (array<float>) and active
     * (bool).
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    activate: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL activate(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },
    /**
     * Returns a bike object:
     * id (int), city_id (string), status_id (int),
     * status_descr (string), charge_perc (float 0.00-1.00),
     * coords (array), active (bool)
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    getOne: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL single_bike(?);`, [bikeId]);

        return this.adjTypes(result[0][0]);
    },

    /**
     * Returns all bikes regardless
     * of status_id, including
     * inactive and unavailable ones.
     * @returns {Promise<Array>}
     */
    getAll: async function() {
        const result = await db.queryNoArgs(`CALL all_bikes();`);
        return result[0].map((bikeObj) => {
            return this.adjTypes(bikeObj);
        });
    },

    /**
     * Returns only available bikes in one
     * city (for ordinary users)
     * @param {String} cityId
     * @returns {Promise<Array>}
     */
    getAvail: async function(cityId) {
        const result = await db.queryWithArgs(`CALL available_bikes(?);`, [cityId]);
        return result[0].map((bikeObj) => {
            return this.adjTypes(bikeObj);
        });
    },

    /**
     * Returns all bikes in one city (for admin)
     * @param {String} cityId
     * @returns {Promise<Array>}
     */
    getAllInCity: async function(cityId) {
            const result = await db.queryWithArgs(`CALL bikes_in_city(?);`, [cityId]);
            return result[0].map((bikeObj) => {
                return this.adjTypes(bikeObj);
        });
    },
    /**
     * An array with all available statuses.
     * Each status object contains id and descr
     * @returns {Promise<Array>}
     */
    statuses: async function() {
        const result = await db.queryNoArgs(`CALL bike_statuses();`);
        return result[0];
    },

    /**
     * Updates status_id of a bike,
     * returns the updated bike-object:
     * id, city_id, status_id, status_descr,
     * charge_perc, coords, active (bool)
     * @param {Number} bikeId
     * @param {Number} statusId
     * @returns {Promise<Object>}
     */
    updStatus: async function(bikeId, statusId) {
        const result = await db.queryWithArgs(`CALL upd_bike_status(?, ?);`, [bikeId, statusId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * Updates the city_id of a bike,
     * returns the updated bike-object:
     * id, city_id, status_id, status_descr,
     * charge_perc, coords, active (bool)
     * @param {Number} bikeId
     * @param {String} cityId
     * @returns {Promise<Object>}
     */
    updCity: async function(bikeId, cityId) {
        const result = await db.queryWithArgs(`CALL update_bike_city(?, ?);`, [bikeId, cityId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * Updates the bikes status,
     * charge percentrage and
     * coordinates.
     * Does not return anything
     * @param {Number} bikeId
     * @param {Number} bikeStatus
     * @param {Number} chargePerc
     * @param {Array} bikeCoords
     */
    updateBike: async function(
        bikeId,
        bikeStatus,
        chargePerc,
        bikeCoords
    ) {
        const endedTrip = await db.queryWithArgs(`CALL update_bike(?, ?, ?, ?);`, [bikeId, bikeStatus, chargePerc, JSON.stringify(bikeCoords)]);
        if (endedTrip.length > 0) {
            return tripModel.adjTypes(endedTrip[0][0]);
        }
        return undefined;
    }


}

export default bike;