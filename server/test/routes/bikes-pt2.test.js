/* global it describe afterEach */

import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../app.js';
import clientManager from '../../src/utils/clientManager.js';
import bikeModel from '../../src/models/bike.js';

import sinonChai from 'sinon-chai';
chai.use(sinonChai);


const expect = chai.expect;
chai.use(chaiHttp);


const bikeApiKey = "ee54283c18caea5a49abd8328258d2dd";

describe('/v1/bikes/:id put route, additional', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('trip ends after bike update because of low battery, clientManager should broadcast to both both bikes and clients', (done) => {
        const updateBikeStub = sinon.stub(bikeModel, 'updateBike').returns({
            id: 53,
            user_id: 4,
            bike_id: 1,
            start_pos: [11.9721,57.70229],
            end_pos: [12.2, 12.3],
            start_cost: 10.00,
            var_cost: 15 * 3,
            park_cost: 100.00,
            total_cost: 155.00
        });
        const bikeData = {
            'id': 1,
            'status_id': 1,
            'charge_perc': 0.3,
            'coords': [12.2, 12.3],
            'speed': 12
        }
        const broadcastToClientsStub = sinon.stub(clientManager, 'broadcastToClients');
        const broadcastToBikesStub = sinon.stub(clientManager, 'broadcastToBikes');
        chai.request(app)
            .put('/v1/bikes/1')
            .set('x-api-key', bikeApiKey)
            .send(bikeData)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
                expect(res.body).to.be.empty;
                expect(updateBikeStub).to.have.been.calledOnceWith(1, 1, 0.3, [12.2, 12.3], bikeApiKey);

                expect(broadcastToClientsStub).to.have.been.calledOnceWith(bikeData);

                expect(broadcastToBikesStub).to.have.been.calledOnceWith(
                    1,
                    sinon.match({
                        bike_id: 1,
                        instruction: "lock_bike"
                    })
                );

                done();
            });
    });

    
    it('trip is not ended after bike update, clientManager should broadcast to clients but not to bikes', (done) => {
        const updateBikeStub = sinon.stub(bikeModel, 'updateBike').returns();
        const bikeData = {
            'id': 1,
            'status_id': 1,
            'charge_perc': 0.3,
            'coords': [12.2, 12.3],
            'speed': 12
        }
        const broadcastToClientsStub = sinon.stub(clientManager, 'broadcastToClients');
        const broadcastToBikesStub = sinon.stub(clientManager, 'broadcastToBikes');
        chai.request(app)
            .put('/v1/bikes/1')
            .set('x-api-key', bikeApiKey)
            .send(bikeData)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
                expect(res.body).to.be.empty;
                expect(updateBikeStub).to.have.been.calledOnceWith(1, 1, 0.3, [12.2, 12.3], bikeApiKey);

                expect(broadcastToClientsStub).to.have.been.calledOnceWith(bikeData);

                expect(broadcastToBikesStub).to.not.have.been.called;

                done();
            });
    });
});