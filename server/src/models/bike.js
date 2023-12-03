import { db } from "./db.js"


const bike = {
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
     * @param {Int} bikeId 
     * @returns {Object}
     */
    getOne: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL single_bike(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * Returns all bikes, including
     * inactive and unavailable ones.
     * @returns {Array}
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
     * @returns {Array}
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
     * @returns {Array}
     */
    getAllInCity: async function(cityId) {
            const result = await db.queryWithArgs(`CALL bikes_in_city(?);`, [cityId]);
            return result[0].map((bikeObj) => {
                return this.adjTypes(bikeObj);
        });
    },

    /**
     * 
     * @param {Int} bikeId 
     * @returns {Object}
     */
    activate: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL activate(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @param {Int} bikeId 
     * @returns {Object}
     */
    deactivate: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL deactivate(?);`, [bikeId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @returns {Array}
     */
    statuses: async function() {
        const result = await db.queryNoArgs(`CALL bike_statuses();`);
        return result[0];
    },

    /**
     * 
     * @param {Int} bikeId 
     * @param {Int} statusId
     * @returns {Object}
     */
    updStatus: async function(bikeId, statusId) {
        const result = await db.queryWithArgs(`CALL upd_bike_status(?, ?);`, [bikeId, statusId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @param {Int} bikeId 
     * @param {String} cityId
     * @returns {Object}
     */
    updCity: async function(bikeId, cityId) {
        const result = await db.queryWithArgs(`CALL update_bike_city(?, ?);`, [bikeId, cityId]);
        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @param {Int} bikeId 
     * @param {Int} bikeStatus 
     * @param {Float} chargePerc 
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