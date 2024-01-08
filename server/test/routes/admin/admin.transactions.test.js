/* global it describe after before */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import paymentModel from '../../../src/models/payment.js';
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

describe('/v1/admin/transactions routes', () => {
    let userPaymentsStub;
    let userPaymentsPagStub;
    let allPaymentsStub;
    let allPaymentsPagStub;

    before(() => {
        userPaymentsStub = sinon.stub(paymentModel, 'userPayments');
        userPaymentsPagStub = sinon.stub(paymentModel, 'userPaymentsPag');
        allPaymentsStub = sinon.stub(paymentModel, 'allPayments');
        allPaymentsPagStub = sinon.stub(paymentModel, 'allPaymentsPag');
    });

    after(() => {
        userPaymentsStub.restore();
        userPaymentsPagStub.restore();
        allPaymentsStub.restore();
        allPaymentsPagStub.restore();
    });

    it('should get transactions for one user', async () => {
        const res = await chai.request(app)
            .post('/v1/admin/transactions')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userPaymentsStub.calledOnce).to.be.true;
        expect(userPaymentsStub.calledWith(1)).to.be.true;
    });

    it('should handle errors when getting transactions from one user', async () => {
        const fakeError = new Error('Fake error');
        userPaymentsStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/admin/transactions')
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

    it('should get paginated transactions for one user', async () => {
        const res = await chai.request(app)
            .post('/v1/admin/transactions/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userPaymentsPagStub.calledOnce).to.be.true;
        expect(userPaymentsPagStub.calledWith(1, 1, 1)).to.be.true;
    });

    it('should handle errors when getting paginated transactions from one user', async () => {
        const fakeError = new Error('Fake error');
        userPaymentsPagStub.withArgs(1, 1, 1).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/admin/transactions/limit/1/offset/1')
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

    it('should get all transactions', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/transactions/all')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(allPaymentsStub.calledOnce).to.be.true;
        expect(allPaymentsStub.calledWith()).to.be.true;
    });

    it('should handle errors when getting all transactions', async () => {
        const fakeError = new Error('Fake error');
        allPaymentsStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/transactions/all')
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

    it('should get all transactions paginated', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/transactions/all/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(allPaymentsPagStub.calledOnce).to.be.true;
        expect(allPaymentsPagStub.calledWith()).to.be.true;
    });

    it('should handle errors when getting all transactions paginated', async () => {
        const fakeError = new Error('Fake error');
        allPaymentsPagStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/transactions/all/limit/1/offset/1')
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
