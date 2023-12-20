import chai from 'chai';
import chaiHttp from 'chai-http';
// import express from 'express';
import sinon from 'sinon';
import apiKeyHandler from '../src/middleware/apiKey-handler.js';
import apiKeyModel from '../src/models/api-key.js';
import errorHandler from '../src/middleware/error-handler.js';

const expect = chai.expect;
chai.use(chaiHttp);

describe('API Key Handler Middleware', () => {
    let req, res, next, apiKeyStub;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
        next = sinon.spy();

        apiKeyStub = sinon.stub(apiKeyModel, 'checkOne');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle API key provided as an array and validate the first key', async () => {
        req.headers['x-api-key'] = ['valid_key', 'another_key'];

        apiKeyStub.withArgs('valid_key').resolves(true);
        
        await apiKeyHandler(req, res, next);

        sinon.assert.calledWith(apiKeyStub, 'valid_key');
        sinon.assert.calledOnce(next);
    });

    it('should return 401 if no API key is provided', async () => {
        await apiKeyHandler(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({
            success: false,
            message: 'API key is required.'
        })).to.be.true;
    });

    it('should return 401 if an invalid API key is provided', async () => {
        req.headers['x-api-key'] = 'invalid_key';
        apiKeyStub.resolves(false);

        await apiKeyHandler(req, res, next);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith({
            success: false,
            message: 'Invalid or missing API key. Access denied.'
        })).to.be.true;
    });

    it('should call next() if a valid API key is provided', async () => {
        req.headers['x-api-key'] = 'valid_key';
        apiKeyStub.resolves(true);

        await apiKeyHandler(req, res, next);

        expect(next.calledOnce).to.be.true;
    });
});

describe('Error Handler Middleware', () => {
    let req, res, next, error;

    beforeEach(() => {
        req = {};
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(), // Allows for chaining status().json()
            headersSent: false
        };
        next = sinon.spy();
        error = new Error('Test error');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should send a 500 status and error message when an error occurs', () => {
        errorHandler(error, req, res, next);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({
            errors: {
            message: 'Test error',
            code: 500
            }
        })).to.be.true;
    });

    it('should call next if headers have already been sent', () => {
        res.headersSent = true;

        errorHandler(error, req, res, next);

        expect(next.calledWith(error)).to.be.true;
    });

    it('should log error stack if NODE_ENV is not test', () => {
        const consoleErrorStub = sinon.stub(console, 'error').returnsThis();

        process.env.NODE_ENV = 'development';

        errorHandler(error, req, res, next);

        expect(consoleErrorStub.calledWith(error.stack)).to.be.true;

        process.env.NODE_ENV='test';

    });
});
