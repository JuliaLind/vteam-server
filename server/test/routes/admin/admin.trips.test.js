/* global it describe after before */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import tripModel from '../../../src/models/trip.js';
import jwt from 'jsonwebtoken';

const apiKey = "d22728e26ed8a9479e911829e9784108";

const jwtSecret = process.env.JWT_SECRET;
const payload = {
    id: 1,
    role: "admin"
};

// ok token
const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/admin/trips routes', () => {
    let userTripsStub;
    let userTripsPagStub;
    let allTripsStub;
    let allTripsPagStub;

    before(() => {
        userTripsStub = sinon.stub(tripModel, 'userTrips');
        userTripsPagStub = sinon.stub(tripModel, 'userTripsPag');
        allTripsStub = sinon.stub(tripModel, 'allTrips');
        allTripsPagStub = sinon.stub(tripModel, 'allTripsPag');
    });

    after(() => {
        userTripsStub.restore();
        userTripsPagStub.restore();
        allTripsStub.restore();
        allTripsPagStub.restore();
    });

    it('should get trips for one user', async () => {
        const res = await chai.request(app)
            .post('/v1/admin/trips')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userTripsStub.calledOnce).to.be.true;
        expect(userTripsStub.calledWith(1)).to.be.true;
    });

    it('should handle errors when getting trips from one user', async () => {
        const fakeError = new Error('Fake error');
        userTripsStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/admin/trips')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({ user_id: 1 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get paginated trips for one user', async () => {
        const res = await chai.request(app)
            .post('/v1/admin/trips/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userTripsPagStub.calledOnce).to.be.true;
        expect(userTripsPagStub.calledWith(1, 1, 1)).to.be.true;
    });

    it('should handle errors when getting paginated trips from one user', async () => {
        const fakeError = new Error('Fake error');
        userTripsPagStub.withArgs(1, 1, 1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/admin/trips/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({ user_id: 1 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get all trips', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/trips/all')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(allTripsStub.calledOnce).to.be.true;
        expect(allTripsStub.calledWith()).to.be.true;
    });

    it('should handle errors when getting all trips', async () => {
        const fakeError = new Error('Fake error');
        allTripsStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/trips/all')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get all trips paginated', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/trips/all/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(allTripsPagStub.calledOnce).to.be.true;
        expect(allTripsPagStub.calledWith()).to.be.true;
    });

    it('should handle errors when getting all trips paginated', async () => {
        const fakeError = new Error('Fake error');
        allTripsPagStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/trips/all/limit/1/offset/1')
            .set('x-access-token', jwtToken)
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
