import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import paymentModel from '../../../src/models/payment.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/user/payment route', () => {
    let paymentStub;

    before(() => {
        paymentStub = sinon.stub(paymentModel, 'prepay');
    });

    after(() => {
        sinon.restore();
    });

    it('should post new payment', async () => {
        const receiptData = [{
            amount: 123
        }];
        paymentStub.withArgs(1, 123).resolves(receiptData);

        const res = await chai.request(app).post('/v1/user/payment').send({amount: 123, userId: 1});

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(receiptData);
        expect(paymentStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to post new payment', async () => {
        const fakeError = new Error('Fake error');
        paymentStub.withArgs(1, 123).rejects(fakeError);

        const res = await chai.request(app).post('/v1/user/payment').send({amount: 123, userId: 1});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
