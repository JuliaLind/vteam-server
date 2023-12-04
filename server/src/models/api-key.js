import { db } from "./db.js"


const apiKey = {
    keys: [],

    /**
     * Gets all active api keys from
     * DB and stores in the keys array
     */
    getActiveFromDB: async function() {
        const result = await db.queryNoArgs(`CALL active_api_keys();`);
        this.keys = result[0].map((elem) => {
            return elem.key;
        })
    },

    /**
     * Returns true if the key is valid and active
     * @param {String} apiKey 
     * @returns {Boolean}
     */
    checkOne: async function(apiKey) {
        if (this.keys.length === 0) {
            const result = await this.getActiveFromDB();
        }
        return this.keys.includes(apiKey);
    },

};

export default apiKey;
