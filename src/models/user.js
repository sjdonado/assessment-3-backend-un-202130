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
  const newUser = {
    id: USERS.length + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginDate: null,
    active: true,
    ...user,
  };

  USERS.push(newUser);

  resolve(newUser);
});

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @param {(find|filter)} kind
 * @returns {Object|Array}
 */
const find = ({ where }, kind) => new Promise((resolve, reject) => {
  const filters = Object.keys(where);
  const user = USERS[kind]((obj) => {
    let match = true;
    filters.forEach((filter) => {
      // eslint-disable-next-line eqeqeq
      if (obj[filter] != where[filter]) {
        match = false;
      }
    });
    return match;
  });

  resolve(user);
});

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns {Object}
 */
const findOne = (where) => find(where, 'find');

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns number
 */
const count = async (where) => (await find(where, 'filter')).length;

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns {Object}
 */
const update = (whereClause, newValues) => new Promise((resolve, reject) => {
  findOne(whereClause)
    .then((user) => {
      if (!user) {
        resolve(null);
      }
      Object.assign(user, newValues);
      resolve(user);
    })
    .catch((err) => reject(err));
});

module.exports = {
  create,
  findOne,
  update,
  count,
};
