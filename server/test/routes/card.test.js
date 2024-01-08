import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import cardModel from '../../src/models/card.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('/v1/card routes', () => {
    let cardTypeStub;

    before(() => {
        cardTypeStub = sinon.stub(cardModel, 'getTypes');
    });

    after(() => {
        sinon.restore();
    });

    it('should get card types', async () => {
        const fakeBikeData = [{
            types: ["visa", "mastercard"]
        }];
        cardTypeStub.withArgs().resolves(fakeBikeData);

        const res = await chai.request(app)
            .get('/v1/card/types')
            .set('x-api-key', "28f6f3b936b1640bd81114121cfae649");

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(fakeBikeData);
        expect(cardTypeStub.calledOnce).to.be.true;
    });

    it('should handle errors when trying to get card types', async () => {
        const fakeError = new Error('Fake error');
        cardTypeStub.withArgs().rejects(fakeError);

        const res = await chai.request(app)
            .get('/v1/card/types')
            .set('x-api-key', "28f6f3b936b1640bd81114121cfae649");

        expect(res).to.have.status(500);
        expect(res.body).to.deep.equal({
            errors: {
                code: 500,
                message: "Fake error"
            }
        });
    });
});
