import { db } from "./db.js";
import hat from "hat";


const apiKey = {
    /**
     * Associative array with all active API
     * keys and their respective type, for
     * example: bike, admin, other etc
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
     * @param {String} apiKey
     */
    isBikeKey: function(apiKey) {
        if (this.keys[apiKey] !== "bike") {
            throw new Error(`API key '${apiKey}' does not belong to a bike client. Method not allowed`)
        }
    },
    /**
     * Registers the email of third party
     * to database with a unique api key. The
     * key will have the client type "other"
     * @param {String} email 
     * @returns {Object} associative array with api key and the email
     */
    newThirdParty: async function(email) {
        let result = await db.queryNoArgs(`CALL all_keys();`);
        const allKeys = result[0].map(elem => elem.key);

        let newKey = hat();

        while (allKeys.includes(newKey)) {
            newKey = hat();
        }

        result = await db.queryWithArgs(`CALL new_third_party(?,?);`, [email, newKey]);


        return result[0][0];
    }


};

export default apiKey;
