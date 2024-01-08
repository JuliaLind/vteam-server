import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import userModel from "../../../src/models/user.js";
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

describe('/v1/user/balance route', () => {
    let userSearchStub;

    before(() => {
        userSearchStub = sinon.stub(userModel, 'search');
    });

    after(() => {
        sinon.restore();
    });

    it('should get user balance', async () => {
        const balanceData = {
            balance: 261.93
        };
        userSearchStub.withArgs(4).resolves(balanceData);

        const res = await chai.request(app)
            .post('/v1/user/balance')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(balanceData);
        expect(userSearchStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get user balance', async () => {
        const fakeError = new Error('Fake error');
        userSearchStub.withArgs(4).rejects(fakeError);

        const res = await chai.request(app)
            .post('/v1/user/balance')
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
