# Node.js Senior-Level Live Coding Challenge

## Challenge: Implement a Rate Limiter Middleware

### Description
You are tasked with creating a rate limiter middleware for an Express.js application. The rate limiter should restrict the number of requests a user can make to a specific route within a given time window.

### Requirements
1. **Middleware Function:**
   - Create a middleware function called `rateLimiter` that takes in two parameters: `maxRequests` (the maximum number of requests allowed) and `windowMs` (the time window in milliseconds).
   - The middleware should track the number of requests made by each unique IP address.

2. **Logic:**
   - If a user exceeds the maximum number of requests within the specified time window, the middleware should block further requests by sending a `429 Too Many Requests` status code.
   - Once the time window has passed, the request count for that IP address should reset.

3. **Persistence:**
   - Implement a simple in-memory store to keep track of request counts and timestamps for each IP address.
   - Discuss how you would scale this solution to work in a distributed system where requests may be handled by multiple instances of your server.

4. **Testing:**
   - Write tests to verify the correct behavior of the rate limiter under different scenarios (e.g., within limits, exceeding limits, resetting after time window).

5. **Optimization:**
   - Consider how you would optimize the middleware for high performance, especially in a high-traffic environment.
   - Discuss potential bottlenecks and how to address them.

### Bonus Points
- Implement the rate limiter using a more scalable storage solution like Redis instead of in-memory storage.
- Provide detailed comments and documentation for the middleware.

### Evaluation Criteria
- **Correctness:** Does the middleware function correctly enforce the rate limits?
- **Code Quality:** Is the code clean, well-structured, and easy to understand?
- **Performance:** Does the candidate consider and address performance implications?
- **Testing:** Are there comprehensive tests covering different scenarios?
- **Scalability:** How well does the solution scale in a distributed environment?

