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
    userPayments: async function(
        userId
    ) {
        const result = await db.queryWithArgs(`CALL user_payments(?);`, [userId]);

        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    /**
     * 
     * @param {Number} userId 
     * @param {Number} offset 
     * @param {Number} limit 
     * @returns {Promise<Array>}
     */
    userPaymentsPag: async function(
        userId,
        offset,
        limit
    ) {
        const result = await db.queryWithArgs(`CALL user_payments(?, ?, ?);`, [userId, offset, limit]);
        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    adjustTypes: function(transaction) {
        return {
            ...transaction,
            amount: parseFloat(transaction.amount)
        };
    },
    prepay: async function(userId, payment) {
        const result = await db.queryWithArgs(`CALL prepay(?, ?);`, [userId, payment]);

        const receipt = result[0][0];

        receipt.amount = parseFloat(receipt.amount);
        receipt.balance = parseFloat(receipt.balance);

        return receipt;
    }
};

export default payment;
