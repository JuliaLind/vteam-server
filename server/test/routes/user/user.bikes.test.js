/* global it describe after before */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import tripModel from '../../../src/models/trip.js';
import clientManager from '../../../src/utils/clientManager.js';
import { users } from '../../dummy-data/users.js';
import jwt from 'jsonwebtoken';

const apiKey = "5ec80c034a778b80c91c0fc02f020fa2";

const jwtSecret = process.env.JWT_SECRET;
// ok token
// console.log(users[0].id)
const payload = {
    id: users[0].id,
    email: users[0].email
}
const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/user/bikes routes', () => {
    let startTripStub;
    let endTripStub;
    let broadcastStub;

    before(() => {
        startTripStub = sinon.stub(tripModel, 'start');
        endTripStub = sinon.stub(tripModel, 'end');
        broadcastStub = sinon.stub(clientManager, 'broadcastToBikes');
    });

    after(() => {
        sinon.restore();
    });

    it('should start trip', async () => {
        const fakeTripData = { trip_id: 1 };
        startTripStub.withArgs(4, 1).resolves(fakeTripData);

        const res = await chai.request(app)
            .post('/v1/user/bikes/rent/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 4});
        
        // console.log(res);

        expect(res).to.have.status(200);
        expect(startTripStub.calledOnce).to.be.true;
        expect(broadcastStub.calledWith(1, {
            bike_id: 1,
            instruction: "set_status",
            args: [2]
        })).to.be.true;
    });

    it('should handle errors when trying to start trip', async () => {
        const fakeError = new Error('Fake error');
        startTripStub.withArgs(4, 1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/bikes/rent/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 4});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should end trip', async () => {
        const fakeTripData = { bike_id: 1 };
        endTripStub.withArgs(4, 1).resolves(fakeTripData);

        const res = await chai.request(app)
            .put('/v1/user/bikes/return/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 4});

        expect(res).to.have.status(200);
        expect(endTripStub.calledOnce).to.be.true;
        expect(broadcastStub.calledWith(1, {
            bike_id: 1,
            instruction: "set_status",
            args: [1]
        })).to.be.true;
    });

    it('should handle errors when trying to end trip', async () => {
        const fakeError = new Error('Fake error');
        endTripStub.withArgs(4, 1).rejects(fakeError);

        const res = await chai.request(app)
        .put('/v1/user/bikes/return/1')
        .set('x-access-token', jwtToken)
        .set('x-api-key', apiKey)
        .send({user_id: 4});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

});
