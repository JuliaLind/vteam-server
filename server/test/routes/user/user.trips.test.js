import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import tripModel from '../../../src/models/trip.js';
import { users } from '../../dummy-data/users.js';
import jwt from 'jsonwebtoken';

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
        const res = await chai.request(app)
            .post('/v1/user/trips')
            .set('x-access-token', jwtToken)
            .send({user_id: 4});

        expect(res).to.have.status(200);
        expect(userTripsStub.calledOnce).to.be.true;
        expect(userTripsStub.calledWith(4)).to.be.true;
    });

    it('should handle errors when getting trips from one user', async () => {
        const fakeError = new Error('Fake error');
        userTripsStub.withArgs(4).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/trips')
            .set('x-access-token', jwtToken)
            .send({ user_id: 4 });

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
            .post('/v1/user/trips/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .send({user_id: 4});

        expect(res).to.have.status(200);
        expect(userTripsPagStub.calledOnce).to.be.true;
        expect(userTripsPagStub.calledWith(4, 1, 1)).to.be.true;
    });

    it('should handle errors when getting paginated trips from one user', async () => {
        const fakeError = new Error('Fake error');
        userTripsPagStub.withArgs(4, 1, 1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/trips/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .send({ user_id: 4 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
