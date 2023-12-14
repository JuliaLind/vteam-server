import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import paymentModel from '../../../src/models/payment.js';

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
        const res = await chai.request(app).get('/v1/user/transactions').send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userPaymentsStub.calledOnce).to.be.true;
        expect(userPaymentsStub.calledWith(1)).to.be.true;
    });

    it('should handle errors when getting transactions from one user', async () => {
        const fakeError = new Error('Fake error');
        userPaymentsStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/user/transactions').send({ user_id: 1 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should get paginated transactions for one user', async () => {
        const res = await chai.request(app).get('/v1/user/transactions/limit/1/offset/1').send({user_id: 1});

        expect(res).to.have.status(200);
        expect(userPaymentsPagStub.calledOnce).to.be.true;
        expect(userPaymentsPagStub.calledWith(1, 1, 1)).to.be.true;
    });

    it('should handle errors when getting paginated transactions from one user', async () => {
        const fakeError = new Error('Fake error');
        userPaymentsPagStub.withArgs(1, 1, 1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/user/transactions/limit/1/offset/1').send({ user_id: 1 });

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
