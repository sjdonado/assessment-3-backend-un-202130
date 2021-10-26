const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');
const BaseSerializer = require('../serializers/BaseSerializer');

// Create new user
const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    if (body === undefined || body.id === undefined || body.active === false) {
      throw new ApiError('Payload must contain name, username, email or password', 400);
    }

    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

// Deactivate User
const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.id === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    await User.update(
      { where: { id: params.id } },
      { active: false },
    );

    res.json(new BaseSerializer('success', null));
  } catch (err) {
    next(err);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.id === undefined || user.active === undefined) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

// Update User
const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;

    let user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.id === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    Object.keys(body).forEach(
      (usrd) => {
        if (usrd !== 'username' && usrd !== 'email' && usrd !== 'name') {
          throw new ApiError('Payload can only contain username, email or name', 400);
        }
      },
    );

    user = await User.update(
      { where: { id: params.id } }, {
        username: body.username ? body.username : user.username,
        name: body.name ? body.name : user.name,
        email: body.email ? body.email : user.email,
      },
    );

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
  deactivateUser,
  updateUser,
};
