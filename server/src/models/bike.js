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
    }


}

export default bike;