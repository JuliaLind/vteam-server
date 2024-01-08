/* global it describe after before */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import paymentModel from '../../../src/models/payment.js';
import { users } from '../../dummy-data/users.js';
import jwt from 'jsonwebtoken';

const apiKey = "79318b63f8638fe9b648b687cad142d8";

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

describe('/v1/user/transactions routes', () => {
    let userPaymentsStub;
    let userPaymentsPagStub;

    before(() => {
        userPaymentsStub = sinon.stub(paymentModel, 'userPayments');
        userPaymentsPagStub = sinon.stub(paymentModel, 'userPaymentsPag');
    });

    after(() => {
        userPaymentsStub.restore();
        userPaymentsPagStub.restore();
    });

    it('should get transactions for one user', async () => {
        const res = await chai.request(app)
            .post('/v1/user/transactions')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 4});

        expect(res).to.have.status(200);
        expect(userPaymentsStub.calledOnce).to.be.true;
        expect(userPaymentsStub.calledWith(4)).to.be.true;
    });

    it('should handle errors when getting transactions from one user', async () => {
        const fakeError = new Error('Fake error');
        userPaymentsStub.withArgs(4).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/transactions')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({ user_id: 4 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get paginated transactions for one user', async () => {
        const res = await chai.request(app)
            .post('/v1/user/transactions/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 4});

        expect(res).to.have.status(200);
        expect(userPaymentsPagStub.calledOnce).to.be.true;
        expect(userPaymentsPagStub.calledWith(4, 1, 1)).to.be.true;
    });

    it('should handle errors when getting paginated transactions from one user', async () => {
        const fakeError = new Error('Fake error');
        userPaymentsPagStub.withArgs(4, 1, 1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/transactions/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
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
