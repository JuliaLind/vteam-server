/* global it describe */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import apiKeyModel from "../src/models/api-key.js";





describe('api key model', () => {
    const keys = [
        {
            id: 1,
            key: "28f6f3b936b1640bd81114121cfae649",
            active: true,
            status_updated: "2023-10-01",
        },
        {
            id: 2,
            key: "02311fc3c16ab94abd005e82e4ada31c",
            active: true,
            status_updated: "2023-10-01",
        },
        {
            id: 3,
            key: "9ecf1298e36401fb8da2cc7daa255625",
            active: false,
            status_updated: "2023-10-10",
        },
        {
            id: 4,
            key: "abab305362ca929f20ad5465026341a2",
            active: true,
            status_updated: "2023-10-12",
        }
    ];
    beforeEach(async () => {
        let sql = `DELETE FROM api_key;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO api_key VALUES(?, ?, ?, ?),
            (?, ?, ?, ?),
            (?, ?, ?, ?),
            (?, ?, ?, ?);`
        let args = [
            keys[0].id, keys[0].key, keys[0].active, keys[0].status_updated,
            keys[1].id, keys[1].key, keys[1].active, keys[1].status_updated,
            keys[2].id, keys[2].key, keys[2].active, keys[2].status_updated,
            keys[3].id, keys[3].key, keys[3].active, keys[3].status_updated,

        ];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    it('test getActiveFromDB', async () => {
        await apiKeyModel.getActiveFromDB();

        expect(apiKeyModel.keys).to.deep.equal([
            "28f6f3b936b1640bd81114121cfae649",
            "02311fc3c16ab94abd005e82e4ada31c",
            "abab305362ca929f20ad5465026341a2",
        ]);
    });

    it('test check one active', async () => {
        const result = await apiKeyModel.checkOne("02311fc3c16ab94abd005e82e4ada31c");

        expect(result).to.be.true;
    });

    it('test check one inactive', async () => {
        const result = await apiKeyModel.checkOne("9ecf1298e36401fb8da2cc7daa255625");

        expect(result).to.be.false;
    });
});
