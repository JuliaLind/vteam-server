import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import cityModel from '../../src/models/city.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/zones route', () => {
    let allZonesStub;

    before(() => {
        allZonesStub = sinon.stub(cityModel, 'allZones');
    });

    after(() => {
        sinon.restore();
    });

    it('should get all zones', async () => {
        const fakeBikeData = [{
            zones: []
        }];
        allZonesStub.withArgs().resolves(fakeBikeData);

        const res = await chai.request(app).get('/v1/zones');

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(allZonesStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get all zones', async () => {
        const fakeError = new Error('Fake error');
        allZonesStub.withArgs().rejects(fakeError);

        const res = await chai.request(app).get('/v1/zones');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
