const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'mariadb',
    user: 'root',
    database: process.env.DB_NAME,
    password: process.env.DB_ROOT_PASSWORD,
    // connectionLimit: 5
});

export const db = {
    pool: pool,


}