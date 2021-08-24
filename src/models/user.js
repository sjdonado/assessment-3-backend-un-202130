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
  const userKeys = Object.keys(user);
  if (!userKeys.includes('username') || !userKeys.includes('email')) {
    reject(new Error('Invalid object'));
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
    reject(new Error('User not found'));
  }

  resolve(user);
});

module.exports = {
  create,
  getbyId,
};
