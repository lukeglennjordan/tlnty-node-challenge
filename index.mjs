import express from 'express';
import rateLimiter from './rateLimiter.js'; // Note the '.js' extension

const app = express();

app.use(rateLimiter(5, 60 * 1000)); // 5 requests per 60 seconds

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
