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

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/admin/simulate route', () => {
    let broadcastStub;

    before(() => {
        broadcastStub = sinon.stub(clientManager, 'broadcastToBikes');
    });

    after(() => {
        broadcastStub.restore();
    });

    it('should activate a bike and return the bike data', async () => {
        const res = await chai.request(app)
            .get('/v1/admin/simulate')
            .set('x-access-token', jwtToken)
            .set('x-api-key', apiKey);

        expect(res).to.have.status(204);
        expect(broadcastStub.calledWith(-1, { instruction_all: 'run_simulation' })).to.be.true;
    });

    it('should handle errors when trying to activate', async () => {
        const fakeError = new Error('Fake error');
        broadcastStub.withArgs(-1, { instruction_all: 'run_simulation' }).callsFake(() => {
            throw fakeError;
        });

        const res = await chai.request(app)
            .get('/v1/admin/simulate')
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
