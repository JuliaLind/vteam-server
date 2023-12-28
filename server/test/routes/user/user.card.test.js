import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import cardModel from '../../../src/models/card.js';
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

describe('/v1/user/card routes', () => {
    let userDetailsStub;
    let updateDetailsStub;

    before(() => {
        userDetailsStub = sinon.stub(cardModel, 'userDetails');
        updateDetailsStub = sinon.stub(cardModel, 'updUserDetails');
    });

    after(() => {
        sinon.restore();
    });

    it('should get user details', async () => {
        const fakeUserData = {
            card_nr: 1234,
            card_type: "visa"
        };
        userDetailsStub.withArgs(4).resolves(fakeUserData);

        const res = await chai.request(app)
            .get('/v1/user/card')
            .set('x-access-token', jwtToken)
            .send({userId: 4});

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeUserData);
        expect(userDetailsStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get user details', async () => {
        const fakeError = new Error('Fake error');
        userDetailsStub.withArgs(4).rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/user/card')
            .set('x-access-token', jwtToken)
            .send({userId: 4});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should update user details', async () => {
        const fakeUserData = {
            card_nr: 1234,
            card_type: "mastercard"
        };
        updateDetailsStub.withArgs(4, 1234, "mastercard").resolves(fakeUserData);

        const res = await chai.request(app)
            .put('/v1/user/card')
            .set('x-access-token', jwtToken)
            .send({userId: 4, card_nr: 1234, card_type: "mastercard"});

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeUserData);
        expect(updateDetailsStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to update user details', async () => {
        const fakeError = new Error('Fake error');
        updateDetailsStub.withArgs(4, 1234, "mastercard").rejects(fakeError);

        const res = await chai.request(app)
            .put('/v1/user/card')
            .set('x-access-token', jwtToken)
            .send({userId: 4, card_nr: 1234, card_type: "mastercard"});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
