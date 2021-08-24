const request = require('supertest');
const app = require('../app');

const USERS_PATH = '/users';

const FAKE_USER = {
  username: 'myusername',
  name: 'Tester user',
  email: 'tester@test.com',
};

describe('Users routes', () => {
  it('Should create user', async () => {
    const payload = {
      password: '12345',
      passwordConfirmation: '12345',
      ...FAKE_USER,
    };
    const response = await request(app).post(USERS_PATH).send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.username).toBe(payload.username);
    expect(response.body.data.email).toBe(payload.email);

    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.passwordConfirmation).toBeUndefined();
  });

  it('Should get user by id', async () => {
    const USER_ID = 1;
    const response = await request(app).get(`${USERS_PATH}/${USER_ID}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.name).toBe(FAKE_USER.name);
    expect(response.body.data.username).toBe(FAKE_USER.username);
    expect(response.body.data.email).toBe(FAKE_USER.email);

    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.passwordConfirmation).toBeUndefined();
  });
});
