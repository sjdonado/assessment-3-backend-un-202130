const ApiError = require('../utils/ApiError');
const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

/** User utils */

const isBodyEmpty = (json) => json && Object.keys(json).length === 0;

const isPayloadInvalid = (payload, keys) => {
  let invalid = false;
  keys.forEach((key) => {
    if (!(key in payload)) {
      invalid = true;
    }
  });
  return invalid;
};

const areKeysInvalid = (payload, keys) => {
  let invalid = false;
  keys.forEach((key) => {
    if (key in payload) {
      invalid = true;
    }
  });
  return invalid;
};

const isUserActive = (user) => {
  if (!user) {
    throw new ApiError('User not found', 400);
  }

  if (user.active !== undefined) {
    if (user.active !== true) {
      throw new ApiError('User not found', 400);
    }
  }
  return user;
};

/** Routes */
const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const keys = [
      'name',
      'email',
      'username',
      'password',
      'passwordConfirmation',
    ];

    if (isBodyEmpty(body) || isPayloadInvalid(body, keys)) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
      active: true,
    });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });

    isUserActive(user);

    if (user.lastLoginDate === null) {
      user.active = undefined;
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { body } = req;
    const badKeys = [
      'password',
      'passwordConfirmation',
    ];

    if (isBodyEmpty(body) || areKeysInvalid(body, badKeys)) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const user = await User.findOne({ where: { id: params.id } });
    isUserActive(user);

    const updatedUser = await User.update({ where: { id: params.id } }, body);
    res.json(new UserSerializer(updatedUser));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    isUserActive(user);

    await User.update({ where: { id: params.id } }, { active: false });

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
