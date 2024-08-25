

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../rateLimitData.json');


export const rateLimiter = (maxRequests, windowMs) => {
    // const filePath = path.join(__dirname, 'rateLimitData.json');

    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        let rateLimitData = {};

        try {
            rateLimitData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (err) {
            rateLimitData = {};
        }

        if (!rateLimitData[ip]) {
            rateLimitData[ip] = [];
        }

        // Remove expired requests
        rateLimitData[ip] = rateLimitData[ip].filter(timestamp => now - timestamp < windowMs);

        if (rateLimitData[ip].length >= maxRequests) {
            return res.status(429).send('Too many requests. Please try again later.');
        }

        rateLimitData[ip].push(now);
        fs.writeFileSync(filePath, JSON.stringify(rateLimitData), 'utf-8');
        next();
    };
};

export default rateLimiter;
