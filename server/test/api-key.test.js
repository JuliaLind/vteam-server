/* global it describe before */

import chai from 'chai';
chai.should();
const expect = chai.expect;

import { db } from "../src/models/db.js";
import apiKeyModel from "../src/models/api-key.js";

describe('api key model', () => {
    before(async () => {
        const conn = await db.pool.getConnection();
        const sql = `
        DELETE FROM api_key WHERE \`key\` = ?;
        INSERT INTO api_key(client_type_id, \`key\`, \`active\`)
        VALUES(?, ?, ?);`;
        const args = ["9ecf1298e36401fb8da2cc7daa255625",
        "other",
        "9ecf1298e36401fb8da2cc7daa255625",
        false];


        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
    });
    it('test getActiveFromDB', async () => {
        apiKeyModel.keys = {};
        expect(apiKeyModel.keys).to.deep.equal({});
        await apiKeyModel.getActiveFromDB();

        expect(apiKeyModel.keys).to.deep.equal({
            "ee54283c18caea5a49abd8328258d2dd": "bike",
            "d22728e26ed8a9479e911829e9784108": "admin",
            "5ec80c034a778b80c91c0fc02f020fa2": "user-app",
            "79318b63f8638fe9b648b687cad142d8": "user-webb"
        });
    });

    it('active key', async () => {
        apiKeyModel.keys = {};

        expect(apiKeyModel.keys).to.deep.equal({});
        const result = await apiKeyModel.checkOne("d22728e26ed8a9479e911829e9784108");


        expect(result).to.be.true;
        expect(apiKeyModel.keys).to.deep.equal({
            "ee54283c18caea5a49abd8328258d2dd": "bike",
            "d22728e26ed8a9479e911829e9784108": "admin",
            "5ec80c034a778b80c91c0fc02f020fa2": "user-app",
            "79318b63f8638fe9b648b687cad142d8": "user-webb"
        });
    });

    it('new third party', async () => {
        // register new third party
        const email = "third@party.com";
        const res = await apiKeyModel.newThirdParty(email);

        expect(res.email).to.equal(email);
        expect(res.key).to.be.a.string;
        expect(res.key.length).to.equal(32);

        // try register same third party again, should throw an error
        try {
            await apiKeyModel.newThirdParty(email);
            throw new Error(`Expected SqlError (email ${email} already registered with key ${res.key})`);
        } catch (error) {
            expect(error.sqlState).to.equal('45000');
            expect(error.message).to.include(`email ${email} already registered with key ${res.key}`);
        }

        await apiKeyModel.getActiveFromDB();

        expect(apiKeyModel.keys).to.deep.equal({
            "ee54283c18caea5a49abd8328258d2dd": "bike",
            "d22728e26ed8a9479e911829e9784108": "admin",
            "5ec80c034a778b80c91c0fc02f020fa2": "user-app",
            "79318b63f8638fe9b648b687cad142d8": "user-webb",
            [res.key]: "other"
        });
        // reset
        apiKeyModel.keys = {}
        let sql = `DELETE FROM third_party WHERE email = ?;
        DELETE FROM api_key WHERE \`key\` = ?;`;
        const conn = await db.pool.getConnection();
        const args = [email, res.key];
        await conn.query(sql, args);
        if (conn) conn.end();
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

    it('check if key belongs to a bike ok', async () => {
        const bikeApiKey = 'ee54283c18caea5a49abd8328258d2dd';

        // check that the key is active
        const res = await apiKeyModel.checkOne(bikeApiKey)
        expect(res).to.be.true;

        // should not throw error because key belongs to a bike
        expect(() => apiKeyModel.isBikeKey(bikeApiKey)).to.not.throw();
    });

    it('check if api key belongs to a bike not ok', async () => {
        const userApiKey = '5ec80c034a778b80c91c0fc02f020fa2';
        const res = await apiKeyModel.checkOne(userApiKey)

        // check that the key itself is active
        expect(res).to.be.true;

        // should throw error because the key does not belong to a bike
        expect(() => apiKeyModel.isBikeKey(userApiKey)).to.throw(Error, `API key '${userApiKey}' does not belong to a bike client. Method not allowed`);
    });
});
