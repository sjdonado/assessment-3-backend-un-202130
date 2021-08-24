const request = require('supertest');

const app = require('../app');

describe('Index routes', () => {
  it('Should return not found', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Not found');
  });
});
