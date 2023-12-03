import { db } from "./db.js"


const card = {
    getTypes: async function() {
        const result = await db.queryNoArgs(`CALL card_types();`);
        return result[0];
    },
    /**
     * 
     * @param {Int} userId 
     * @returns {Objetct}
     */
    userDetails: async function(userId) {
        const result = await db.queryWithArgs(`CALL user_card(?);`, [userId]);
        return result[0][0];
    }
}

export default card;
