import { db } from "./db.js"


const payment = {
    invoice: async function() {
        const result = await db.queryNoArgs(`CALL invoice();`);
        const data = {
            ...result[0][0],
            ...result[1][0]
        };
        data.invoiced_users = parseInt(data.invoiced_users);
        data.invoiced_amount = parseFloat(data.invoiced_amount);

        return data;
    },
    user_payments: async function(
        userId
    ) {
        const result = await db.queryWithArgs(`CALL user_payments(?);`, [userId]);
        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    /**
     * 
     * @param {Int} userId 
     * @param {Int} offset 
     * @param {Int} limit 
     * @returns {Array}
     */
    user_payments_pag: async function(
        userId,
        offset,
        limit
    ) {
        const result = await db.queryWithArgs(`CALL user_payments(?, ?, ?);`, [userId, offset, limit]);
        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    adjustTypes: async function(transaction) {
        return {
            ...transaction,
            amount: parseFloat(transaction.amount)
        };
    }
    
};

export default payment;
