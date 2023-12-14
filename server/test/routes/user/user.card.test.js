import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import cardModel from '../../../src/models/card.js';
import clientManager from '../../../src/utils/clientManager.js';

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
        userDetailsStub.withArgs(1).resolves(fakeUserData);

        const res = await chai.request(app).get('/v1/user/card').send({userId: 1});

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeUserData);
        expect(userDetailsStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get user details', async () => {
        const fakeError = new Error('Fake error');
        userDetailsStub.withArgs(1).rejects(fakeError);

        const res = await chai.request(app).get('/v1/user/card').send({userId: 1});

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
        updateDetailsStub.withArgs(1, 1234, "mastercard").resolves(fakeUserData);

        const res = await chai.request(app).put('/v1/user/card').send({userId: 1, card_nr: 1234, card_type: "mastercard"});

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeUserData);
        expect(updateDetailsStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to update user details', async () => {
        const fakeError = new Error('Fake error');
        updateDetailsStub.withArgs(1, 1234, "mastercard").rejects(fakeError);

        const res = await chai.request(app).put('/v1/user/card').send({userId: 1, card_nr: 1234, card_type: "mastercard"});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
