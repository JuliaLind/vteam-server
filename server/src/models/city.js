import { db } from "./db.js"

const city = {
    adjTypes: function(zoneObj) {
        return {
            ...zoneObj,
            geometry: JSON.parse(zoneObj.geometry)
        };
    },
    /**
     * 
     * @returns {Array} all cities
     */
    all: async function() {
        const result = await db.queryNoArgs(`CALL all_cities();`);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    },
    /**
     * 
     * @returns {Array} all zones
     */
    allZones: async function() {
        const result = await db.queryNoArgs(`CALL all_zones();`);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    },
    /**
     * 
     * @param {String} cityId 
     * @returns {Object} single city
     */
    single: async function(cityId) {
        const result = await db.queryWithArgs(`CALL single_city(?);`, [cityId]);

        return this.adjTypes(result[0][0]);
    },

    /**
     * 
     * @param {String} cityId 
     * @returns {Array} Zones in a city
     */
    zonesInCity: async function(cityId) {
        const result = await db.queryWithArgs(`CALL zones_in_city(?);`, [cityId]);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    },
    /**
     * 
     * @param {Int} bikeId 
     * @returns {Array} forbidden zones
     * in the same city as the bike is registered to
     */
    bikeZones: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL bike_zones(?);`, [bikeId]);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    }
}

export default city;