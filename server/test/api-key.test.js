/* global it describe beforeEach */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import apiKeyModel from "../src/models/api-key.js";
import { keys } from './dummy-data/keys.js'





describe('api key model', () => {
    beforeEach(async () => {
        apiKeyModel.keys = [];
        let sql = `DELETE FROM api_key;`;
        const conn = await db.pool.getConnection();
        await conn.query(sql);

        sql = `INSERT INTO api_key VALUES(?, ?, ?, ?),
            (?, ?, ?, ?),
            (?, ?, ?, ?),
            (?, ?, ?, ?);`
        let args = [];

        for (const key of keys) {
            args = args.concat([key.id, key.key, key.active, key.status_updated])
        }

        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    it('test getActiveFromDB', async () => {
        expect(apiKeyModel.keys).to.deep.equal([]);
        await apiKeyModel.getActiveFromDB();

        expect(apiKeyModel.keys).to.deep.equal([
            "28f6f3b936b1640bd81114121cfae649",
            "02311fc3c16ab94abd005e82e4ada31c",
            "abab305362ca929f20ad5465026341a2",
        ]);
    });

    it('active key', async () => {
        const result = await apiKeyModel.checkOne("02311fc3c16ab94abd005e82e4ada31c");

        expect(result).to.be.true;
    });

    it('inactive key', async () => {
        const result = await apiKeyModel.checkOne("9ecf1298e36401fb8da2cc7daa255625");

        expect(result).to.be.false;
    });

    it('key not in db', async () => {
        const result = await apiKeyModel.checkOne("notavalidkey");

        expect(result).to.be.false;
    });

    it('missing key', async () => {
        const result = await apiKeyModel.checkOne(undefined);

        expect(result).to.be.false;
    });
});
