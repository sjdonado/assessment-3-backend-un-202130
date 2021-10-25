const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    // console.log(body);
    const {
      username, email, name, password, passwordConfirmation,
    } = body;

    if (password !== passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    if (
      (name === undefined || name.length === 0)
      || (username === undefined || username.length === 0)
      || (password === undefined === password === 0)
      || (email === undefined || email.length === 0)
    ) { throw new ApiError('Payload must contain name, username, email and password', 400); }

    const user = await User.create({
      username,
      email,
      name,
      password,
    });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    // console.log(params);
    const user = await User.findOne({ where: { id: params.id } });
    // console.log(user);
    if (user === undefined || user.active === false) throw new ApiError('User not found', 400);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { body } = req;

    const user = await User.update(
      { where: { id: params.id } },
      {
        username: body.username,
        name: body.name,
        email: body.email,
      },
    );

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.update(
      { where: { id: params.id } },
      {
        active: false,
      },
    );

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
};
