import dotenv from "dotenv";
dotenv.config();

import mariadb from 'mariadb';

let host = process.env.DB_HOST;
let database = process.env.DB_DATABASE;

/**
 * Changes to test database
 */
if (process.env.NODE_ENV === "test") {
    host = process.env.DB_TEST_HOST;
    database = process.env.TEST_DATABASE;
}

const pool = mariadb.createPool({
    host: host,
    user: process.env.DB_USER,
    database: database,
    password: process.env.DB_PASSWORD,
    // connectionLimit: 10,
     multipleStatements: true,
    // namedPlaceholders: true
});


export const db = {
    /**
     * For handling connections
     * to the database
     */
    pool: pool,

    /**
     * For database queries without
     * arguments
     * @param {String} sql 
     * @returns {Promise<Array>}
     */
    queryNoArgs: async function(sql) {
        let conn;

        try {
            conn = await pool.getConnection();

            let res = await conn.query(sql);
            return res;
            // no catching error here
        } finally {
            if (conn) {
                conn.end();
            }
        }
    },

    /**
     * For database queries
     * with arguments
     * @param {String} sql 
     * @param {Array} args 
     * @returns {Promise<Array>}
     */
    queryWithArgs: async function(sql, args) {
        let conn;

        try {
            conn = await pool.getConnection();
            let res = await conn.query(sql, args);
            return res;
            // no catching error here
        } finally {
            if (conn) {
                conn.end();
            }
        }
    },
}