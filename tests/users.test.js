const request = require('supertest');

const app = require('../app');
const User = require('../src/models/user');

const USERS_PATH = '/users';

const FIRST_USER = {
  username: 'user1',
  name: 'User 1',
  email: 'user1@test.com',
  password: '12345',
};

const NEW_USER = {
  username: 'myusername',
  name: 'Tester user',
  email: 'tester@test.com',
};

describe('Users routes', () => {
  beforeAll(async () => {
    await User.create(FIRST_USER);
    await User.create(Object.assign(FIRST_USER, { active: false }));
  });

  it('Should create user', async () => {
    const payload = {
      password: '12345',
      passwordConfirmation: '12345',
      ...NEW_USER,
    };
    const response = await request(app).post(USERS_PATH).send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.username).toBe(payload.username);
    expect(response.body.data.email).toBe(payload.email);
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();
    expect(response.body.data.lastLoginDate).toBeNull();

    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.passwordConfirmation).toBeUndefined();
    expect(response.body.data.active).toBeUndefined();
  });

  it('Should return bad request on create user with invalid payload', async () => {
    const payload = {
      password: '12345',
      passwordConfirmation: '12345',
    };
    const response = await request(app).post(USERS_PATH).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('Payload must contain name, username, email and password');
  });

  it('Should return bad request with missmatch passwords', async () => {
    const payload = {
      password: '12',
      passwordConfirmation: '12345',
      ...NEW_USER,
    };
    const response = await request(app).post(USERS_PATH).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('Passwords do not match');
  });

  it('Should get user by id', async () => {
    const USER_ID = 1;
    const response = await request(app).get(`${USERS_PATH}/${USER_ID}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.name).toBe(FIRST_USER.name);
    expect(response.body.data.username).toBe(FIRST_USER.username);
    expect(response.body.data.email).toBe(FIRST_USER.email);
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();
    expect(response.body.data.lastLoginDate).toBeNull();

    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.active).toBeUndefined();
  });

  it('Should return bad request when user does not exist', async () => {
    const USER_ID = 0;
    const response = await request(app).get(`${USERS_PATH}/${USER_ID}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('User not found');
  });

  it('Should return bad request on get a deactivated user', async () => {
    const USER_ID = 2;
    const response = await request(app).get(`${USERS_PATH}/${USER_ID}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('User not found');
  });

  it('Should update user', async () => {
    const USER_ID = 1;
    const payload = {
      username: 'new_username',
      email: 'new_email@test.com',
      name: 'New name',
    };
    const response = await request(app).put(`${USERS_PATH}/${USER_ID}`).send(payload);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');

    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.username).toBe(payload.username);
    expect(response.body.data.email).toBe(payload.email);
    expect(response.body.data.createdAt).not.toBeNull();
    expect(response.body.data.updatedAt).not.toBeNull();
    expect(response.body.data.lastLoginDate).toBeNull();

    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.active).toBeUndefined();
  });

  it('Should return bad request on update deactivated user', async () => {
    const USER_ID = 2;
    const payload = {
      username: 'new_username',
      email: 'new_email@test.com',
      name: 'New name',
    };
    const response = await request(app).put(`${USERS_PATH}/${USER_ID}`).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('User not found');
  });

  it('Should return bad request on update user with invalid payload', async () => {
    const USER_ID = 1;
    const payload = {
      password: '12345',
    };
    const response = await request(app).put(`${USERS_PATH}/${USER_ID}`).send(payload);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('Payload can only contain username, email or name');
  });

  it('Should deactivate user', async () => {
    const USER_ID = 1;
    const response = await request(app).delete(`${USERS_PATH}/${USER_ID}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toBeNull();

    const totalUsers = await User.count({ where: { active: true } });
    expect(totalUsers).toBe(1);
  });

  it('Should return bad request on deactivate user when does not exist', async () => {
    const USER_ID = 0;
    const response = await request(app).delete(`${USERS_PATH}/${USER_ID}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('User not found');
  });
});
