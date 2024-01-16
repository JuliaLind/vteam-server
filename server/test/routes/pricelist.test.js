/* global it describe after before */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import tripModel from '../../src/models/trip.js';

const apiKey = "d22728e26ed8a9479e911829e9784108";

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/pricelist route', () => {
    let pricelistStub;

    before(() => {
        pricelistStub = sinon.stub(tripModel, 'pricelist');
    });

    after(() => {
        sinon.restore();
    });

    it('should get price list', async () => {
        const fakePriceData = [
            {
                "id": "PARK_HIGH",
                "amount": 100
            },
            {
                "id": "PARK_LOW",
                "amount": 5
            }
        ];
        pricelistStub.withArgs().resolves(fakePriceData);

        const res = await chai.request(app)
            .get('/v1/pricelist')
            .set('x-api-key', apiKey);

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakePriceData);
        expect(pricelistStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get price list', async () => {
        const fakeError = new Error('Fake error');
        pricelistStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/pricelist')
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
