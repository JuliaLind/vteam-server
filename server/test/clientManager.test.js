import clientManager from "../src/utils/clientManager.js";
import sinon from "sinon";
import mocha from "mocha";
import chai from "chai";
const expect = chai.expect;


describe('clientManager', () => {
    let mockRes;

    beforeEach(() => {
        mockRes = {
            write: sinon.stub(),
            end: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should add a new client', () => {
        clientManager.addClient(mockRes);
        expect(clientManager.clients).to.include(mockRes);
    });

    it('should remove a client', () => {
        clientManager.addClient(mockRes);
        expect(clientManager.clients).to.include(mockRes);
        clientManager.removeClient(mockRes);
        expect(clientManager.clients).to.not.include(mockRes);
    });

    it('should add a bike to cachedBikeData', () => {
        const bikeId = 123;
        
        clientManager.addBike(bikeId, mockRes);

        expect(clientManager.cachedBikeData[bikeId]).to.exist;
        expect(clientManager.cachedBikeData[bikeId].res).to.equal(mockRes);
    });

    it('should set bike res to null in cachedBikeData', () => {
        const bikeId = 123;
        clientManager.addBike(bikeId, mockRes);
        clientManager.removeBike(bikeId);
        expect(clientManager.cachedBikeData[bikeId].res).to.be.null;
    });

    it('should broadcast a message to all clients', () => {
        clientManager.addClient(mockRes);
        const message = { test: 'message' };
        clientManager.broadcastToClients(message);
        sinon.assert.calledWith(mockRes.write, `data: ${JSON.stringify(message)}\n\n`);
    });

    it('should broadcast a message to a specific bike', () => {
        const bikeId = 123;
        clientManager.addBike(bikeId, mockRes);
        const message = { test: 'message' };
        clientManager.broadcastToBike(bikeId, message);
        sinon.assert.calledWith(mockRes.write, `data: ${JSON.stringify(message)}\n\n`);
    });
});
