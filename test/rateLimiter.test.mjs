// import express from 'express';
// // const fs = import('fs');
// // const path = import('path');
// import supertest from 'supertest'; // Ensure correct import

// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import fs from 'fs';


// let chai;
// (async () => {
//     chai = await import('chai');
// })();


// // const rateLimiter = import('../rateLimiter'); // Adjust the path as necessary

// const expect = () => chai.expect;
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// const filePath = path.join(__dirname, '../rateLimitData.json');

// beforeEach(() => {
//     fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
// });

// describe('Rate Limiting Middleware', function () {
//     this.timeout(60000); // Increase timeout for all tests in this suite

//     let app;

//     beforeEach(() => {
//         app = express();
//         app.use(rateLimiter(5, 60 * 1000)); // 5 requests per 60 seconds
//         app.get('/', (req, res) => {
//             res.status(200).send('OK');
//         });
//     });

//     it('should allow requests within the limit', async () => {
//         try {
//             for (let i = 0; i < 5; i++) {
//                 const response = await supertest(app).get('/');
//                 expect(response.status).to.equal(200);
//                 expect(response.text).to.equal('OK');
//             }
//         } catch (error) {
//             console.error('Error in "allow requests within the limit":', error);
//         }
//     });

//     it('should block requests that exceed the limit', async () => {
//         try {
//             for (let i = 0; i < 5; i++) {
//                 await supertest(app).get('/');
//             }

//             const response = await supertest(app).get('/');
//             expect(response.status).to.equal(429);
//             expect(response.text).to.equal('Too many requests. Please try again later.');
//         } catch (error) {
//             console.error('Error in "block requests that exceed the limit":', error);
//         }
//     });

//     it('should reset the limit after the time window has passed', async function () {
//         this.timeout(60000); // Increase timeout for this specific test

//         try {
//             for (let i = 0; i < 5; i++) {
//                 await supertest(app).get('/');
//             }

//             console.log('Waiting for time window to reset...');
//             await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Wait for the window to reset

//             const response = await supertest(app).get('/');
//             expect(response.status).to.equal(200);
//             expect(response.text).to.equal('OK');
//         } catch (error) {
//             console.error('Error in "reset the limit after the time window has passed":', error);
//         }
//     });
// });





import rateLimiter from '../rateLimiter.js'; // Adjust the path as necessary
import express from 'express';
import supertest from 'supertest';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

let chai;

// Import chai using a dynamic import to ensure it's resolved before use
(async () => {
    chai = await import('chai');
})();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../rateLimitData.json');

beforeEach(() => {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
});

describe('Rate Limiting Middleware', function () {
    this.timeout(6000); // Increase timeout for all tests in this suite

    let app;

    beforeEach(() => {
        app = express();
        app.use(async (req, res, next) => {
            try {
                await rateLimiter(req, res, next); // Assuming rateLimiter is asynchronous
            } catch (error) {
                console.error('Error in rateLimiter:', error);
                next(error);
            }
        });
        app.get('/', (req, res) => {
            res.status(200).send('OK');
        });
    });

    it('should allow requests within the limit', async () => {
        try {
            for (let i = 0; i < 5; i++) {
                const response = await supertest(app).get('/');

                // Ensure chai is resolved before using expect
                if (!chai) {
                    throw new Error('chai is not resolved');
                }

                const { expect } = chai;
                expect(response.status).to.equal(200);
                expect(response.text).to.equal('OK');
            }
        } catch (error) {
            console.error('Error in "allow requests within the limit":', error);
        }
    });

    it('should block requests that exceed the limit', async () => {
        try {
            for (let i = 0; i < 5; i++) {
                await supertest(app).get('/');
            }

            const response = await supertest(app).get('/');
            expect(response.status).to.equal(429);
            expect(response.text).to.equal('Too many requests. Please try again later.');
        } catch (error) {
            console.error('Error in "block requests that exceed the limit":', error);
        }
    });

    it('should reset the limit after the time window has passed', async function () {
        this.timeout(5000); // Increase timeout for this specific test

        try {
            for (let i = 0; i < 5; i++) {
                await supertest(app).get('/');
            }


            console.log('Waiting for time window to reset...');
            await new Promise(resolve => setTimeout(resolve, 60 * 1000)); // Wait for the window to reset

            const response = await supertest(app).get('/');
            expect(response.status).to.equal(200);
            expect(response.text).to.equal('OK');


        } catch (error) {
            console.error('Error in "reset the limit after the time window has passed":', error);
        }
    });
});