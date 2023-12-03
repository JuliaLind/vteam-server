import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: 'root',
    database: process.env.DB_DATABASE,
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
        } catch (err) {
            // do something
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
        } catch (err) {
            // do something
        } finally {
            if (conn) conn.end();
        }
    },


    // getUsers: async function() {
    //     let conn;

    //     try {
    //         conn = await pool.getConnection();
    //         let sql = `CALL all_users();`;
    //         let res = await conn.query(sql);
    //         return res[0];
    //     } catch (err) {
    //         // do something
    //     } finally {
    //         if (conn) conn.end();
    //     }
    // }
}