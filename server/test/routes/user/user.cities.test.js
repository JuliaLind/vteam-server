import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import bikeModel from '../../../src/models/bike.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/user/cities routes', () => {
    let cityBikesStub;

    before(() => {
        cityBikesStub = sinon.stub(bikeModel, 'getAvail');
    });

    after(() => {
        sinon.restore();
    });

    it('should get available bikes', async () => {
        const fakeBikeData = [{
            id: 1234
        }];
        cityBikesStub.withArgs("1").resolves(fakeBikeData);

        const res = await chai.request(app).get('/v1/user/cities/1/bikes');

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(cityBikesStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get available bikes', async () => {
        const fakeError = new Error('Fake error');
        cityBikesStub.withArgs("1").rejects(fakeError);

        const res = await chai.request(app).get('/v1/user/cities/1/bikes');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
