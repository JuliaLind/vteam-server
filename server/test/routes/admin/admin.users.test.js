/* global it describe */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import userModel from '../../../src/models/user.js';
import paymentModel from '../../../src/models/payment.js';
import { afterEach, beforeEach } from 'mocha';
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

describe('/v1/admin/users routes', () => {
    let allUsersStub;
    let allUsersPagStub;
    let userSearchStub;
    let userInvoiceStub;
    let updateStatusStub;
    let updateEmailStub;

    beforeEach(() => {
        allUsersStub = sinon.stub(userModel, 'all');
        allUsersPagStub = sinon.stub(userModel, 'allPag');
        userSearchStub = sinon.stub(userModel, 'search');
        userInvoiceStub = sinon.stub(paymentModel, 'invoice');
        updateStatusStub = sinon.stub(userModel, 'updStatus');
        updateEmailStub = sinon.stub(userModel, 'updEmail');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should get all users', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/users')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(allUsersStub.calledOnce).to.be.true;
        expect(allUsersStub.calledWith()).to.be.true;
    });

    it('should handle errors when getting all users', async () => {
        const fakeError = new Error('Fake error');
        allUsersStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/users')
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

    it('should get all users paginated', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/users/limit/1/offset/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(allUsersPagStub.calledOnce).to.be.true;
        expect(allUsersPagStub.calledWith(1, 1)).to.be.true;
    });

    it('should handle errors when getting all users paginated', async () => {
        const fakeError = new Error('Fake error');
        allUsersPagStub.withArgs(1, 1).rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/users/limit/1/offset/1')
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

    it('should get users through search', async () => {
        const fakeUserData = { user_id: 1 };
        userSearchStub.withArgs("1").resolves(fakeUserData);
        const res = await chai.request(app)
            .get('/v1/admin/users/search/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(userSearchStub.calledOnce).to.be.true;
        expect(userSearchStub.calledWith("1")).to.be.true;
    });

    it('should handle errors when getting users through search', async () => {
        const fakeError = new Error('Fake error');
        userSearchStub.withArgs("1").rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/admin/users/search/1')
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

    it('should get one user', async () => {
        const fakeUserData = [{user_id: 1}];
        userSearchStub.withArgs(1).resolves(fakeUserData);
        const res = await chai.request(app)
            .get('/v1/admin/users/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(userSearchStub.calledWith(1)).to.be.true;
    });

    it('should adjust user balance', async () => {
        const fakeUserData = { user_id: 1 };
        userInvoiceStub.withArgs().resolves(fakeUserData);
        const res = await chai.request(app)
            .put('/v1/admin/users/invoice')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(userInvoiceStub.calledOnce).to.be.true;
        expect(userInvoiceStub.calledWith()).to.be.true;
    });

    it('should handle errors when adjusting user balance', async () => {
        const fakeError = new Error('Fake error');
        userInvoiceStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .put('/v1/admin/users/invoice')
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

    it('should update user status', async () => {
        const fakeUserData = { user_id: 1 };
        updateStatusStub.withArgs(1, true).resolves(fakeUserData);
        const res = await chai.request(app)
            .put('/v1/admin/users/1/status')
            .send({active: true})
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(updateStatusStub.calledOnce).to.be.true;
        expect(updateStatusStub.calledWith(1, true)).to.be.true;
    });

    it('should handle errors when updating user status', async () => {
        const fakeError = new Error('Fake error');
        updateStatusStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .put('/v1/admin/users/1/status')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({active: true});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });

    it('should update user email', async () => {
        const fakeUserData = { user_id: 1 };
        updateEmailStub.withArgs(1, "john@example.com").resolves(fakeUserData);
        const res = await chai.request(app)
            .put('/v1/admin/users/1/email')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({email: "john@example.com"});

        expect(res).to.have.status(200);
        expect(updateEmailStub.calledOnce).to.be.true;
        expect(updateEmailStub.calledWith(1, "john@example.com")).to.be.true;
    });

    it('should handle errors when updating user email', async () => {
        const fakeError = new Error('Fake error');
        updateEmailStub.withArgs(1, "john@example.com").rejects(fakeError);

        const res = await chai.request(app)
            .put('/v1/admin/users/1/email')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .send({email: "john@example.com"});

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});

describe('/v1/admin/users/:id - getting one user', () => {
    let userSearchStub;

    beforeEach(() => {
        userSearchStub = sinon.stub(userModel, 'search').throws(new Error('Test error'));
    });

    afterEach(() => {
        userSearchStub.restore();
    });

    it('should handle errors correctly', (done) => {
        chai.request(app)
            .get('/v1/admin/users/1')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(userSearchStub).to.throw(err);
                expect(res).to.have.status(500);
                expect(res.body).to.deep.equal(
                    { errors: { message: 'Test error', code: 500 } }
                );
                done();
            });
    });
});