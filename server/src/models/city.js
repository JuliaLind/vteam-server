import { db } from "./db.js"

const city = {
    adjTypes: function(zoneObj) {
        return {
            ...zoneObj,
            geometry: JSON.parse(zoneObj.geometry)
        };
    },
    all: async function() {
        const result = await db.queryNoArgs(`CALL all_cities();`);

        return result[0].map((zone) => {
            return this.adjTypes(zone);
        });
    }
}

export default city;