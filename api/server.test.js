const request = require('supertest');

const server = require('./server');

// Jokes endpoint
describe('jokes', () => {
    it('Requires authentication - rejects unauthorized requests', async () => {
        const expectedStatus = 401;
        const response = await request(server).get('/api/jokes');
        expect(response.status).toEqual(expectedStatus);
    });

    it('Requires authentication - allows authorized requests', async () => {
        const expectedStatus = 200;
        const response = await request(server).get('/api/jokes')
                                              .set({'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkIjoiMjAyMC0wMy0yMFQyMzo0MDo0MS43MjdaIiwiaWF0IjoxNTg0NzQ3NjQxLCJleHAiOjE1ODQ4MzQwNDF9.pPl6oYNjTQGlGYy6_Bq0z4sT3fSE8BgRGoS8XUHwL18'});
        expect(response.status).toEqual(expectedStatus);
    });
});

// Register endpoint
describe('register', () => {
    it('Requires username and password - errors on attempts without both', async () => {
        const expectedStatus = 400;
        const response = await request(server).post('/api/auth/register').send({'username': 'Tester'});
        expect(response.status).toEqual(expectedStatus);
    });

    it('Requires authentication - allows attempts with both', async () => {
        const expectedStatus = 201;
        const fallbackStatus = 503;
        const response = await request(server).post('/api/auth/register').send({'username': 'Tester', 'password': 'testpass'});
        expect([expectedStatus, fallbackStatus]).toContain(response.status);
    });
});

// Login endpoint
describe('login', () => {
    it('Requires username and password - errors on attempts without both', async () => {
        const expectedStatus = 400;
        const response = await request(server).post('/api/auth/login').send({'username': 'Tester'});
        expect(response.status).toEqual(expectedStatus);
    });

    it('Requires proper credentials', async () => {
        const expectedStatus = 200;
        const response = await request(server).post('/api/auth/login').send({'username': 'Tester', 'password': 'testpass'});
        expect(response.status).toEqual(expectedStatus);
    });
});

