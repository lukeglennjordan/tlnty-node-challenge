const express = require('express');
const fs = require('fs');
const path = require('path');
const supertest = require('supertest');
const chai = require('chai');
const rateLimiter = require('./rateLimiter'); // Adjust the path as necessary

const expect = chai.expect;
const filePath = path.join(__dirname, 'rateLimitData.json');

// Clean up the rateLimitData.json before each test
beforeEach(() => {
    fs.writeFileSync(filePath, JSON.stringify({}));
});

describe('Rate Limiting Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(rateLimiter(5, 60 * 1000)); // 5 requests per 60 seconds
        app.get('/', (req, res) => {
            res.status(200).send('OK');
        });
    });

    it('should allow requests within the limit', async () => {
        for (let i = 0; i < 5; i++) {
            const response = await supertest(app).get('/');
            expect(response.status).to.equal(200);
            expect(response.text).to.equal('OK');
        }
    });

    it('should block requests that exceed the limit', async () => {
        for (let i = 0; i < 5; i++) {
            await supertest(app).get('/');
        }

        const response = await supertest(app).get('/');
        expect(response.status).to.equal(429);
        expect(response.text).to.equal('Too many requests. Please try again later.');
    });

    it('should reset the limit after the time window has passed', async () => {
        for (let i = 0; i < 5; i++) {
            await supertest(app).get('/');
        }

        // Wait for the time window to pass
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

        const response = await supertest(app).get('/');
        expect(response.status).to.equal(200);
        expect(response.text).to.equal('OK');
    });
});
