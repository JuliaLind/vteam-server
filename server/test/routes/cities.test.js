import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import cityModel from '../../src/models/city.js';
import bikeModel from '../../src/models/bike.js';

const apiKey = "d22728e26ed8a9479e911829e9784108";

const expect = chai.expect;
chai.use(chaiHttp);

describe('/v1/cities routes', () => {
    let allCitiesStub;
    let oneCityStub;
    let allBikesCityStub;
    let allZonesCityStub;
    let allZonesAndBikesCityStub;

    before(() => {
        allCitiesStub = sinon.stub(cityModel, 'all')
        oneCityStub = sinon.stub(cityModel, 'single')
        allBikesCityStub = sinon.stub(bikeModel, 'getAllInCity')
        allZonesCityStub = sinon.stub(cityModel, 'zonesInCity')
        allZonesAndBikesCityStub = sinon.stub(cityModel, 'chargeParkZones')
    });

    after(() => {
        allCitiesStub.restore();
        oneCityStub.restore();
        allBikesCityStub.restore();
        allZonesCityStub.restore();
        allZonesAndBikesCityStub.restore();
    });

    it('should get all cities', (done) => {
        chai.request(app)
            .get('/v1/cities')
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(allCitiesStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get all cities', async () => {
        const fakeError = new Error('Fake error');
        allCitiesStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/cities')
            .set('x-api-key', apiKey);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get one city', (done) => {
        chai.request(app)
            .get('/v1/cities/1')
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(oneCityStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get one city', async () => {
        const fakeError = new Error('Fake error');
        oneCityStub.withArgs("1").rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/cities/1')
            .set('x-api-key', apiKey);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get all bikes of one city', (done) => {
        chai.request(app)
            .get('/v1/cities/1/bikes')
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(allBikesCityStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get one city', async () => {
        const fakeError = new Error('Fake error');
        allBikesCityStub.withArgs("1").rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/cities/1/bikes')
            .set('x-api-key', apiKey);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get all zones of one city', (done) => {
        chai.request(app)
            .get('/v1/cities/1/zones')
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(allZonesCityStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get one city', async () => {
        const fakeError = new Error('Fake error');
        allZonesCityStub.withArgs("1").rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/cities/1/zones')
            .set('x-api-key', apiKey);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get all stations and zones with bikes', (done) => {
        chai.request(app)
            .get('/v1/cities/zones/stations/bikes')
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(allZonesAndBikesCityStub.calledOnce).be.true;
                done();
            });
    });

    it('should handle errors when trying to get all the above', async () => {
        const fakeError = new Error('Fake error');
        allZonesAndBikesCityStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/cities/zones/stations/bikes')
            .set('x-api-key', apiKey);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
