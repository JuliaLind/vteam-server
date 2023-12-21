/* global it describe beforeEach afterEach */

import chai from 'chai';
chai.should();
const expect = chai.expect;
import { db } from "../src/models/db.js";
import cityModel from "../src/models/city.js";
let zones;
import { bikes } from './dummy-data/bikes.js'

import { insertZones } from './helper.js'





describe('city model part 2', () => {
    beforeEach(async () => {
        const conn = await db.pool.getConnection()
        let sql = `
        DELETE FROM zone_loc_removed;
        DELETE FROM zone_loc;`;

        conn.query(sql);
        if (conn) {
            conn.end();
        }
        zones = await insertZones();
    });
    afterEach(async () => {
        const conn = await db.pool.getConnection()
        let sql = `
        DELETE FROM zone_loc_removed;
        DELETE FROM zone_loc;`;

        await conn.query(sql);
        if (conn) {
            conn.end();
        }
    });
    it('Should return all active zones in a city', async () => {
        let sthlmZones= await cityModel.zonesInCity("STHLM");
        expect(sthlmZones.length).to.equal(3);
        expect(sthlmZones).to.deep.equal(zones.filter(zone => zone.city_id === "STHLM"));

        let gbgZones = await cityModel.zonesInCity("GBG");

        let gbg = zones.filter(zone => zone.city_id === "GBG")
        expect(gbgZones.length).to.equal(5);
        expect(gbgZones).to.deep.equal(gbg);

        const removed = gbg[3];
        expect(gbgZones).to.deep.include(removed);
        gbg.splice(3, 1);

        // inactivate one of the zones and make sure
        // it is not selected after deactivation
        const conn = await db.pool.getConnection()
        let sql = `
        INSERT INTO zone_loc_removed(zone_loc_id)
        VALUES(?);`;
        const args = [removed.id];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        gbgZones = await cityModel.zonesInCity("GBG");
        expect(gbgZones.length).to.equal(4);
        expect(gbgZones).to.deep.equal(gbg);
        expect(gbgZones).to.not.deep.include(removed);
    });

    it('Should return all active zones in all cities', async () => {
        let all = await cityModel.allZones();

        expect(all.length).to.equal(8);
        expect(all).to.deep.equal(zones);

        const removed = zones[4];
        const removed2 = zones[6];
        const updated = zones.filter(zone => ![removed.id, removed2.id].includes(zone.id));
        expect(all).to.deep.include(removed);
        expect(all).to.deep.include(removed2);


        // inactivate one of the zones and make sure
        // it is not selected after deactivation
        const conn = await db.pool.getConnection()
        let sql = `
        INSERT INTO zone_loc_removed(zone_loc_id)
        VALUES(?), (?);`;
        const args = [removed.id, removed2.id];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        all = await cityModel.allZones();
        expect(all.length).to.equal(6);
        expect(all).to.deep.equal(updated);
        expect(all).to.not.deep.include(removed);
        expect(all).to.not.deep.include(removed2);
    });

    it("get bikeZones, no forbidden zones in city", async () => {
        let conn = await db.pool.getConnection();

        let sql = `
        DELETE FROM bike;
        INSERT INTO bike VALUES(?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?);
        `;

        let args = [];

        for (const bike of bikes) {
            args = args.concat([bike.id, bike.city_id, bike.status_id, bike.charge_perc, bike.coords, bike.active]);
        }
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        // actual from DB
        let bikeZones= await cityModel.bikeZones(5);

        // full info for bike incl zones and city data
        let krlstBikeData = {
            city_id: 'KRLST',
            speed_limit: 20,
            geometry: JSON.parse('{"coordinates":[[[13.47149547448899,59.42351123209056],[13.456139461258317,59.391963177284964],[13.451778033439552,59.39200430085171],[13.44677046816551,59.384806917023184],[13.440874480138433,59.382462300672216],[13.440066808320239,59.378842217063664],[13.454456522130954,59.380328251521235],[13.455008306024695,59.36965203880712],[13.467422408811956,59.36650276077691],[13.494998873756174,59.36442529328434],[13.507088902154152,59.365665484682864],[13.523968303469587,59.37399632204409],[13.52574083207719,59.3818176237298],[13.533639138847576,59.382155209356654],[13.534091678684263,59.38606010110604],[13.536217812335906,59.39324870125964],[13.559517808257965,59.39553946494996],[13.577249711278029,59.39791779076822],[13.581380532138837,59.40027031518147],[13.587038018373278,59.40555671831828],[13.588242258016493,59.410293995014825],[13.572259059764633,59.415872537155764],[13.541913231360382,59.4200739221034],[13.47149547448899,59.42351123209056]]],"type":"Polygon"}'),
            zones: []
        };
        expect(bikeZones).to.deep.equal(krlstBikeData);
    });
    it("Should return all active zones in the bike's city + city data", async () => {
        let conn = await db.pool.getConnection();

        let sql = `
        DELETE FROM bike;
        INSERT INTO bike VALUES(?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?);
        `;

        let args = [];

        for (const bike of bikes) {
            args = args.concat([bike.id, bike.city_id, bike.status_id, bike.charge_perc, bike.coords, bike.active]);
        }
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        // limited zones in GBG
        let gbgZones = zones.filter(zone => zone.city_id === "GBG" && zone.speed_limit !== undefined)
        let expZones = gbgZones.map((zone) => {
            return {
                zone_id : zone.zone_id,
                geometry: zone.geometry,
                speed_limit: zone.speed_limit
            }
        })
        // actual from DB
        let bikeZones= await cityModel.bikeZones(6);

        // full info for bike incl zones and city data
        let gbgBikeData = {
            city_id: 'GBG',
            speed_limit: 20,
            geometry: JSON.parse('{"coordinates":[[[11.944333910956516,57.67919611123858],[11.967995787555992,57.67458273107127],[12.007998739155909,57.67849715197991],[12.024993457155574,57.700996871231666],[12.028811527258256,57.72496783561451],[11.987762696696421,57.73566592553405],[11.941092586496723,57.73859683290104],[11.904357849897309,57.72226446708444],[11.891669922003103,57.70220684386706],[11.90421986760262,57.6840410615994],[11.925005715003266,57.675094561128674],[11.944333910956516,57.67919611123858]]],"type":"Polygon"}'),
            zones: expZones
        };

        expect(bikeZones).to.deep.equal(gbgBikeData);
        expect(bikeZones.zones.length).to.equal(2);


        let removed = gbgZones[1];

        gbgZones.splice(1, 1);
        expZones = gbgZones.map((zone) => {
            return {
                zone_id : zone.zone_id,
                geometry: zone.geometry,
                speed_limit: zone.speed_limit
            }
        })
        gbgBikeData = {
            ...gbgBikeData,
            zones: expZones
        }
        // inactivate one of the zones and make sure
        // it is not selected after deactivation


        conn = await db.pool.getConnection()
        sql = `
        INSERT INTO zone_loc_removed(zone_loc_id)
        VALUES(?);`;
        args = [removed.id];
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }
        removed = {
            zone_id: removed.zone_id,
            geometry: removed.geometry,
            speed_limit: removed.speed_limit
        }
        expect(bikeZones.zones).to.deep.include(removed);

        bikeZones = await cityModel.bikeZones(6);
        expect(bikeZones.zones.length).to.equal(1);
        expect(bikeZones).to.deep.equal(gbgBikeData);
        expect(bikeZones.zones).to.not.deep.include(removed);
    });
    it("Should return city data incl empty zones array if no limited zones in the city", async () => {
        let conn = await db.pool.getConnection();

        let sql = `
        DELETE FROM bike;
        INSERT INTO bike VALUES(?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?);
        `;

        let args = [];

        for (const bike of bikes) {
            args = args.concat([bike.id, bike.city_id, bike.status_id, bike.charge_perc, bike.coords, bike.active]);
        }
        await conn.query(sql, args);
        if (conn) {
            conn.end();
        }

        // bikeZones when there are no limited zones in a city
        let bikeZones= await cityModel.bikeZones(5);
        expect(bikeZones).to.deep.equal({
            city_id: 'KRLST',
            speed_limit: 20,
            geometry: JSON.parse('{"coordinates":[[[13.47149547448899,59.42351123209056],[13.456139461258317,59.391963177284964],[13.451778033439552,59.39200430085171],[13.44677046816551,59.384806917023184],[13.440874480138433,59.382462300672216],[13.440066808320239,59.378842217063664],[13.454456522130954,59.380328251521235],[13.455008306024695,59.36965203880712],[13.467422408811956,59.36650276077691],[13.494998873756174,59.36442529328434],[13.507088902154152,59.365665484682864],[13.523968303469587,59.37399632204409],[13.52574083207719,59.3818176237298],[13.533639138847576,59.382155209356654],[13.534091678684263,59.38606010110604],[13.536217812335906,59.39324870125964],[13.559517808257965,59.39553946494996],[13.577249711278029,59.39791779076822],[13.581380532138837,59.40027031518147],[13.587038018373278,59.40555671831828],[13.588242258016493,59.410293995014825],[13.572259059764633,59.415872537155764],[13.541913231360382,59.4200739221034],[13.47149547448899,59.42351123209056]]],"type":"Polygon"}'),
            zones: []
        });
    });
});
