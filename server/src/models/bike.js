import { db } from "./db.js"


const bike = {
    /**
     * Returns true om cykeln har en pågående resa,
     * i annat fall false
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    isRented: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL is_rented(?);`, [bikeId]);
        if (result[0][0]) {
            return true;
        }
        return false;
    },

    adjTypes(bikeObj) {
        const newObj = {
            id: bikeObj.id,
            city_id: bikeObj.city_id,
            status_id: bikeObj.status_id,
            status_descr: bikeObj.status_descr,
            charge_perc: parseFloat(bikeObj.charge_perc),
            coords: JSON.parse(bikeObj.coords),
            active: bikeObj.active === 1,
        };
        return newObj;
    },

    /**
     * 
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    getOne: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL single_bike(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * Returns all bikes, including
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
     * Returns only available bikes,
     * to be used for user routes
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
     * Returns only available bikes,
     * to be used for user routes
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
     * 
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    activate: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL activate(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @param {Number} bikeId
     * @returns {Promise<Object>}
     */
    deactivate: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL deactivate(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @returns {Promise<Array>}
     */
    statuses: async function() {
        const result = await db.queryNoArgs(`CALL bike_statuses();`);
        return result[0];
    },

    /**
     * 
     * @param {Number} bikeId
     * @param {Number} statusId
     * @returns {Promise<Object>}
     */
    updStatus: async function(bikeId, statusId) {
        const result = await db.queryWithArgs(`CALL upd_bike_status(?, ?);`, [bikeId, statusId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @param {Number} bikeId
     * @param {String} cityId
     * @returns {Promise<Object>}
     */
    updCity: async function(bikeId, cityId) {
        const result = await db.queryWithArgs(`CALL update_bike_city(?, ?);`, [bikeId, cityId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
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
        await db.queryWithArgs(`CALL update_bike(?, ?, ?, ?);`, [bikeId, bikeStatus, chargePerc, JSON.stringify(bikeCoords)]);
    }


}

export default bike;