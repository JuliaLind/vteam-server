import { db } from "./db.js"

const city = {
    /**
     * "prettifies" a zone or city
     * object. If the value of speed_limit
     * attribute is 0 the attribute is removed.
     * Value of the geometry object
     * is converted from string to geoJson
     * geometry object
     * @param {Object} zoneObj 
     * @returns {Object} zoneObj 
     */
    adjTypes: function(zoneObj) {
        zoneObj.speed_limit === null ? delete zoneObj.speed_limit : zoneObj.speed_limit
        return {
            ...zoneObj,
            geometry: JSON.parse(zoneObj.geometry)
        };
    },
    /**
     * Returns data for a single city:
     * id, name, general speed limit, and
     * geometry.
     * @param {String} cityId 
     * @returns {Promise<Object>} single city
     */
    single: async function(cityId) {
        const result = await db.queryWithArgs(`CALL single_city(?);`, [cityId]);

        return this.adjTypes(result[0][0]);
    },
    /**
     * Returns an array with all cities.
     * A cityobject contains id, name, general speed limit, and
     * geometry
     * @returns {Promise<Array>} all cities
     */
    all: async function() {
        const result = await db.queryNoArgs(`CALL all_cities();`);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    },
    /**
     * Returns all active zones in all cities.
     *  A zone object contains id, zone_id,
     * descr, city_id, geometry and
     * speed_limit for limited (forbidden)
     * zones
     * @returns {Promise<Array>} all zones
     */
    allZones: async function() {
        const result = await db.queryNoArgs(`CALL all_zones();`);


        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    },
    /**
     * Returns array with all zone objects
     * in a city. Zoneobject contains:
     * id, zone_id (type of zone),
     * descr, city_id, geometry and speed_limit. If a zone does
     * no have a speed_limit it will not have the attribute
     * @param {String} cityId 
     * @returns {Promise<Array>} All
     * zones in a city 
     */
    zonesInCity: async function(cityId) {
        const result = await db.queryWithArgs(`CALL zones_in_city(?);`, [cityId]);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    },

    /**
     *  Returns city id, geometry and
     * general speed limit for a city,
     * and an array with
     * forbidden zone objects
     * in the same city as the bike is
     * registered to: geometry, zone_id
     * (3) ans speed_limit (0)
     * @param {Number} bikeId 
     * @returns {Promise<Object>} 
     * 
     */
    bikeZones: async function(bikeId) {
        const result = await db.queryWithArgs(`CALL bike_zones(?);`, [bikeId]);

        const city = this.adjTypes(result[0][0]);
        const zones = result[1] ? result[1].map((zone) => {
            return this.adjTypes(zone);
        }) : [];
        return {
            ...city,
            zones: zones
        };
    }
}

export default city;