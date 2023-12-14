import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import cityModel from '../../src/models/city.js';
import bikeModel from '../../src/models/bike.js';

const expect = chai.expect;
chai.use(chaiHttp);

describe('/v1/cities routes', () => {
    let allCitiesStub;
    let oneCityStub;
    let allBikesCityStub;
    let allZonesCityStub;

    before(() => {
        allCitiesStub = sinon.stub(cityModel, 'all')
        oneCityStub = sinon.stub(cityModel, 'single')
        allBikesCityStub = sinon.stub(bikeModel, 'getAllInCity')
        allZonesCityStub = sinon.stub(cityModel, 'zonesInCity')
    });

    after(() => {
        allCitiesStub.restore();
        oneCityStub.restore();
        allBikesCityStub.restore();
        allZonesCityStub.restore();
    });

    it('should get all cities', (done) => {
        chai.request(app)
            .get('/v1/cities')
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

        const res = await chai.request(app).get('/v1/cities');

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

        const res = await chai.request(app).get('/v1/cities/1');

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

        const res = await chai.request(app).get('/v1/cities/1/bikes');

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

        const res = await chai.request(app).get('/v1/cities/1/zones');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
