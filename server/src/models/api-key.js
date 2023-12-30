import { db } from "./db.js"


const apiKey = {
    /**
     * An array with all active API keys
     * @type {Array<String,String>}
     */
    keys: {},

    /**
     * Gets all active api keys from
     * DB and stores in the keys array
     */
    getActiveFromDB: async function() {
        this.keys = {}
        const result = await db.queryNoArgs(`CALL active_api_keys();`);

        /**
         * @type {Array<Object>}
         */
        const activeKeys = result[0];

        for (const elem of activeKeys) {
            this.keys[elem.key] = elem.client_type_id;
        }

    },

    /**
     * Returns true if the key is valid and active
     * @param {String} apiKey 
     * @returns {Promise<Boolean>}
     */
    checkOne: async function(apiKey) {
        if (Object.keys(this.keys).length === 0) {
            await this.getActiveFromDB();
        }

        return apiKey in this.keys;
    },
    /**
     * Checks if api key belongs to a bike.
     * When this method is called the checkOne method
     * will always have been called before, thus there
     * is no need to check if this.keys is empty
     */
    isBikeKey(apiKey) {
        if (this.keys[apiKey] !== "bike") {
            throw new Error(`API key '${apiKey}' does not belong to a bike client. Method not allowed`)
        }
    }

};

export default apiKey;
