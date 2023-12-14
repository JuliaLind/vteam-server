import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import tripModel from '../../../src/models/trip.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/user/trips routes', () => {
    let userTripsStub;
    let userTripsPagStub;

    before(() => {
        userTripsStub = sinon.stub(tripModel, 'userTrips');
        userTripsPagStub = sinon.stub(tripModel, 'userTripsPag');
    });

    after(() => {
        userTripsStub.restore();
        userTripsPagStub.restore();
    });

    it('should get trips for one user', async () => {
        const res = await chai.request(app).get('/v1/user/trips').send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userTripsStub.calledOnce).to.be.true;
        expect(userTripsStub.calledWith(1)).to.be.true;
    });

    it('should handle errors when getting trips from one user', async () => {
        const fakeError = new Error('Fake error');
        userTripsStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/user/trips').send({ user_id: 1 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get paginated trips for one user', async () => {
        const res = await chai.request(app).get('/v1/user/trips/limit/1/offset/1').send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userTripsPagStub.calledOnce).to.be.true;
        expect(userTripsPagStub.calledWith(1, 1, 1)).to.be.true;
    });

    it('should handle errors when getting paginated trips from one user', async () => {
        const fakeError = new Error('Fake error');
        userTripsPagStub.withArgs(1, 1, 1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/user/trips/limit/1/offset/1').send({ user_id: 1 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
