import mariadb from 'mariadb';

let host = process.env.DB_HOST;
let database = process.env.DB_DATABASE;

if (process.env.NODE_ENV === "test") {
    host = process.env.DB_TEST_HOST,
    database = process.env.TEST_DATABASE
}

const pool = mariadb.createPool({
    host: host,
    user: 'root',
    database: database,
    password: process.env.DB_PASSWORD,
    // connectionLimit: 10,
    // multipleStatements: true,
    // namedPlaceholders: true
});

export const db = {
    pool: pool,

    queryNoArgs: async function(sql) {
        let conn;

        try {
            conn = await pool.getConnection();

            let res = await conn.query(sql);
            return res;
            // no catching error here
        } finally {
            if (conn) conn.end();
        }
    },

    queryWithArgs: async function(sql, args) {
        let conn;

        try {
            conn = await pool.getConnection();
            let res = await conn.query(sql, args);
            return res;
            // no catching error here
        } finally {
            if (conn) conn.end();
        }
    },
}