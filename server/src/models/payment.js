import { db } from "./db.js"


const payment = {
    /**
     * "Invoices" of all users or the
     * outstanding (negative) balance as
     * per now. Inserts one new transaction
     * into payments for each user and updates the users' balances.
     * The invoiced payments have reference
     * like "AUTO ***1810" as compared to
     * prepaid paymets that have reference
     * like "***1810"
     *
     * Returns an object containing:
     * invoiced_users (int) and invoiced_amount (float)
     * @returns {Promise<Object>}
     */
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
    /**
     * Returns all payments for a single
     * user, latest on first
     * @param {Number} userId 
     * @returns 
     */
    userPayments: async function(
        userId
    ) {
        const result = await db.queryWithArgs(`CALL user_payments(?);`, [userId]);

        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    /**
     * Returnes payments for single
     * user in an interval, latest on first
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
        const result = await db.queryWithArgs(`CALL user_payments_pag(?, ?, ?);`, [userId, offset, limit]);
        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    /**
     * Returns all payments, sorted with
     * latest one first
     * @returns {Promise<Array>}
     */
    allPayments: async function() {
        const result = await db.queryNoArgs(`CALL all_payments();`);

        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    /**
     * Returns all payments in an interval,
     * latest one first
     * @param {Number} offset 
     * @param {Number} limit 
     * @returns {Promise<Array>}
     */
    allPaymentsPag: async function(
        offset,
        limit
    ) {
        const result = await db.queryWithArgs(`CALL all_payments_pag(?, ?);`, [offset, limit]);
        return result[0].map((transaction) => {
            return this.adjustTypes(transaction);
        });
    },
    /**
     * Decimal numbers are returned from
     * database as string, this method
     * is to convert those values
     * to type float
     * @param {Object} transaction 
     * @returns {Object}
     */
    adjustTypes: function(transaction) {
        return {
            ...transaction,
            amount: parseFloat(transaction.amount)
        };
    },
    /**
     * Registers a prepay payment for a
     * user and updates users balance.
     * Negative numbers will throw an error,
     * Returns an object with the payment
     * details and the new balance:
     * id, user_id, date, ref, amount
     *  balance
     * @param {Number} userId 
     * @param {Number} payment 
     * @returns {Promise<Object>}
     */
    prepay: async function(userId, payment) {
        const result = await db.queryWithArgs(`CALL prepay(?, ?);`, [userId, payment]);

        const receipt = result[0][0];

        receipt.amount = parseFloat(receipt.amount);
        receipt.balance = parseFloat(receipt.balance);

        return receipt;
    }
};

export default payment;
