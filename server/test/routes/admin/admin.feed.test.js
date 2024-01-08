/* global it describe after before beforeEach afterEach */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../../app.js';
import clientManager from '../../../src/utils/clientManager.js';

import jwt from 'jsonwebtoken';

const apiKey = "d22728e26ed8a9479e911829e9784108";

const jwtSecret = process.env.JWT_SECRET;
const payload = {
    id: 1,
    role: "admin"
};

// ok token
const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

const expect = chai.expect;
chai.use(chaiHttp);

describe('/v1/admin/feed route', () => {
    let addClientStub, removeClientStub;

    before(() => {
        addClientStub = sinon.stub(clientManager, 'addClient').callsFake((res) => {
            setTimeout(() => res.end(), 500);
        });
        removeClientStub = sinon.stub(clientManager, 'removeClient');
    });

    after(() => {
        addClientStub.restore();
        removeClientStub.restore();
    });

    it('should manage client connections in feed route', (done) => {
        chai.request(app)
            .get('/v1/admin/feed')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.headers['content-type']).to.include('text/event-stream');
                expect(addClientStub.calledOnce).to.be.true;

                setTimeout(() => {
                    expect(removeClientStub.calledOnce).to.be.true;
                    done();
                }, 600);
            });
    });
});

describe('/v1/admin/feed test error handling', () => {
    let addClientStub;

    beforeEach(() => {
        addClientStub = sinon.stub(clientManager, 'addClient').throws(new Error('Test error'));
    });

    afterEach(() => {
        addClientStub.restore();
    });

    it('should handle errors correctly', (done) => {
        chai.request(app)
            .get('/v1/admin/feed')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey)
            .end((err, res) => {
                expect(addClientStub).to.throw(err);
                expect(res).to.have.status(500);
                done();
            });
    });
});