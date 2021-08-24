const ApiError = require('../utils/ApiError');

const USERS = [];

/**
 *
 * @param {{
 * username: string
 * email: string
 * name: string
 * password: string
 * }} user
 *
 * @returns {Object}
 */
const create = (user) => new Promise((resolve, reject) => {
  if (Object.values(user).some((val) => val === undefined)) {
    reject(new ApiError('Payload must contain name, username and email', 400));
    return;
  }

  const newUser = {
    id: USERS.length + 1,
    createdAt: new Date(),
    updatedAt: null,
    lastLoginDate: null,
    ...user,
  };
  USERS.push(newUser);

  resolve(newUser);
});

/**
 *
 * @param {string} id
 * @returns {Object}
 */
const getbyId = (id) => new Promise((resolve, reject) => {
  const user = USERS.find((elem) => elem.id === Number(id));

  if (!user) {
    reject(new ApiError('User not found', 400));
    return;
  }

  resolve(user);
});

module.exports = {
  create,
  getbyId,
};
