import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import clientManager from '../../src/utils/clientManager.js';
import bikeModel from '../../src/models/bike.js';
import cityModel from '../../src/models/city.js';

const expect = chai.expect;
chai.use(chaiHttp);

const bikeApiKey = "ee54283c18caea5a49abd8328258d2dd";

describe('/v1/bikes routes', () => {
    let addBikeStub;
    let removeBikeStub;
    let statusStub;
    let getAllBikesStub;
    let getOneBikeStub;
    let updateBikeStub;
    let broadcastStub;
    let getBikeZonesStub;

    before(() => {
        addBikeStub = sinon.stub(clientManager, 'addBike').callsFake((id, res) => {
            setTimeout(() => res.end(), 500);
        });
        removeBikeStub = sinon.stub(clientManager, 'removeBike');
        statusStub = sinon.stub(bikeModel, 'statuses');
        getAllBikesStub = sinon.stub(bikeModel, 'getAll');
        getOneBikeStub = sinon.stub(bikeModel, 'getOne');
        updateBikeStub = sinon.stub(bikeModel, 'updateBike');
        broadcastStub = sinon.stub(clientManager, 'broadcastToClients');
        getBikeZonesStub = sinon.stub(cityModel, 'bikeZones');
    });

    after(() => {
        addBikeStub.restore();
        removeBikeStub.restore();
        statusStub.restore();
        getAllBikesStub.restore();
        getOneBikeStub.restore();
        updateBikeStub.restore();
        broadcastStub.restore();
        getBikeZonesStub.restore();
    });

    it('should manage client connections in instructions route', (done) => {
        chai.request(app)
            .get('/v1/bikes/instructions')
            .set('bike_id', "1")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.headers['content-type']).to.include('text/event-stream');
                expect(addBikeStub.calledOnce).to.be.true;

                setTimeout(() => {
                    expect(removeBikeStub.calledOnce).to.be.true;
                    done();
                }, 600);
            });
    });

    it('should get all bike statuses', (done) => {
        chai.request(app)
            .get('/v1/bikes/status')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(statusStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get all bike statuses', async () => {
        const fakeError = new Error('Fake error');
        statusStub.withArgs().rejects(fakeError);

        const res = await chai.request(app).get('/v1/bikes/status');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get all bikes', (done) => {
        chai.request(app)
            .get('/v1/bikes')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(getAllBikesStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get all bikes', async () => {
        const fakeError = new Error('Fake error');
        getAllBikesStub.withArgs().rejects(fakeError);

        const res = await chai.request(app).get('/v1/bikes');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get one bike', (done) => {
        chai.request(app)
            .get('/v1/bikes/1')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(getOneBikeStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get one bike', async () => {
        const fakeError = new Error('Fake error');
        getOneBikeStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/bikes/1');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should update a bike', (done) => {
        chai.request(app)
            .put('/v1/bikes/1')
            .set('x-api-key', bikeApiKey)
            .send({
                'id': 1,
                'status_id': 1,
                'charge_perc': 0.6,
                'coords': [12.2, 12.3],
                'speed': 12
            })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
                expect(updateBikeStub.calledOnce).to.be.true;
                expect(updateBikeStub).to.have.been.calledOnceWith(1, 1, 0.6, [12.2, 12.3], bikeApiKey);
                console.log(res.body);
                expect(broadcastStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should get all zones for a bike', (done) => {
        chai.request(app)
            .get('/v1/bikes/1/zones')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(getBikeZonesStub.calledOnce).to.be.true;
                done();
            });
    });

    it('should handle errors when trying to get zones for bike', async () => {
        const fakeError = new Error('Fake error');
        getBikeZonesStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/bikes/1/zones');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});

describe('/v1/bikes test error handling', () => {
    let addBikeStub;
    let broadcastStub;

    beforeEach(() => {
        addBikeStub = sinon.stub(clientManager, 'addBike').throws(new Error('Test error'));
        broadcastStub = sinon.stub(clientManager, 'broadcastToClients').throws(new Error('Test error'));
    });

    afterEach(() => {
        addBikeStub.restore();
        broadcastStub.restore();
    });

    it('should handle instruction route errors correctly', (done) => {
        chai.request(app)
            .get('/v1/bikes/instructions')
            .set('bike_id', "1")
            .end((err, res) => {
                expect(addBikeStub).to.throw(err);
                expect(res).to.have.status(500);
                done();
            });
    });

    it('should handle errors when trying to update a bike', async () => {
        const res = await chai.request(app).put('/v1/bikes/1')
            .set('x-api-key', bikeApiKey)
            .send({
                'id': 1,
                'status_id': 1,
                'charge_perc': 0.6,
                'coords': [12.2, 12.3],
                'speed': 23
            });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Test error"
            }
        });
    });

    it('should handle errors when trying to update a bike with invalid api key', async () => {
        const userApiKey = "5ec80c034a778b80c91c0fc02f020fa2";
        const res = await chai.request(app).put('/v1/bikes/1')
            .set('x-api-key', userApiKey)
            .send({
                'id': 1,
                'status_id': 1,
                'charge_perc': 0.6,
                'coords': [12.2, 12.3],
                'speed': 23
            });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "API key '5ec80c034a778b80c91c0fc02f020fa2' does not belong to a bike client. Method not allowed"
            }
        });
    });

    it('should handle errors when trying to update a bike with no api key', async () => {
        const res = await chai.request(app).put('/v1/bikes/1')
            .send({
                'id': 1,
                'status_id': 1,
                'charge_perc': 0.6,
                'coords': [12.2, 12.3],
                'speed': 23
            });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "API key 'undefined' does not belong to a bike client. Method not allowed"
            }
        });
    });

    it('should handle NaN error correctly', (done) => {
        chai.request(app)
            .get('/v1/bikes/instructions')
            .set('bike_id', "[]")
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});