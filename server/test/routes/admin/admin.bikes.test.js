import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import bikeModel from '../../../src/models/bike.js';
import clientManager from '../../../src/utils/clientManager.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/admin/bikes routes', () => {
    let activateStub;
    let deactivateStub;
    let updStatusStub;
    let updCityStub;
    let broadcastStub;

    before(() => {
        activateStub = sinon.stub(bikeModel, 'activate');
        deactivateStub = sinon.stub(bikeModel, 'deactivate');
        updStatusStub = sinon.stub(bikeModel, 'updStatus');
        updCityStub = sinon.stub(bikeModel, 'updCity');
        broadcastStub = sinon.stub(clientManager, 'broadcastToBikes');
    });

    after(() => {
        activateStub.restore();
        deactivateStub.restore();
        updStatusStub.restore();
        updCityStub.restore();
        broadcastStub.restore();
    });

    it('should activate a bike and return the bike data', async () => {
        const fakeBikeData = { id: 1 };
        activateStub.withArgs(1).resolves(fakeBikeData);

        const res = await chai.request(app).put('/v1/admin/bikes/1/activate');

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(activateStub.calledOnce).to.be.true;
        expect(broadcastStub.calledWith(1, { bike_id: 1, instruction: 'unlock_bike' })).to.be.true;
    });

    it('should handle errors when trying to activate', async () => {
        const fakeError = new Error('Fake error');
        activateStub.withArgs(2).rejects(fakeError);

        const res = await chai.request(app).put('/v1/admin/bikes/2/activate');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should deactivate a bike and return the bike data', async () => {
        const fakeBikeData = { id: 1 };
        deactivateStub.withArgs(1).resolves(fakeBikeData);

        const res = await chai.request(app).put('/v1/admin/bikes/1/deactivate');

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(deactivateStub.calledOnce).to.be.true;
        expect(broadcastStub.calledWith(1, { bike_id: 1, instruction: 'lock_bike' })).to.be.true;
    });

    it('should handle errors when trying to deactivate', async () => {
        const fakeError = new Error('Fake error');
        deactivateStub.withArgs(2).rejects(fakeError);

        const res = await chai.request(app).put('/v1/admin/bikes/2/deactivate');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it("should change a bike's status and return the bike data", async () => {
        const fakeBikeData = { id: 1 };
        updStatusStub.withArgs(1, 1).resolves(fakeBikeData);

        const res = await chai.request(app).put('/v1/admin/bikes/1/status/1');

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(updStatusStub.calledOnce).to.be.true;
        expect(broadcastStub.calledWith(1, { bike_id: 1, instruction: 'set_status', args: [1] })).to.be.true;
    });

    it('should handle errors when trying to change status', async () => {
        const fakeError = new Error('Fake error');
        updStatusStub.withArgs(1, 2).rejects(fakeError);

        const res = await chai.request(app).put('/v1/admin/bikes/1/status/2');

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it("should change a bike's city and return the bike data", async () => {
        const fakeBikeData = { id: 1 };
        updCityStub.withArgs(1, 3).resolves(fakeBikeData);

        const res = await chai.request(app)
            .put('/v1/admin/bikes/1/change/city')
            .send({ city_id: 3 });

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(updCityStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to change city', async () => {
        const fakeError = new Error('Fake error');
        updCityStub.withArgs(1, 3).rejects(fakeError);

        const res = await chai.request(app)
            .put('/v1/admin/bikes/1/change/city')
            .send({ city_id: 3 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
