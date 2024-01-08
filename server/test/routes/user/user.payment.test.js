import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import paymentModel from '../../../src/models/payment.js';
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
        paymentStub.withArgs(4, 123).resolves(receiptData);

        const res = await chai.request(app)
            .post('/v1/user/payment')
            .set('x-access-token', jwtToken)
            .set('x-api-key', "28f6f3b936b1640bd81114121cfae649")
            .send({amount: 123, userId: 4});

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(receiptData);
        expect(paymentStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to post new payment', async () => {
        const fakeError = new Error('Fake error');
        paymentStub.withArgs(4, 123).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/payment')
            .set('x-access-token', jwtToken)
            .set('x-api-key', "28f6f3b936b1640bd81114121cfae649")
            .send({amount: 123, userId: 4});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
