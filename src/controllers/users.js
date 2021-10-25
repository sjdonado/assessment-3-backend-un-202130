const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const {
      username,
      email,
      name,
      password,
    } = body;

    if (username && email && name && password) {
      const user = await User.create({
        username,
        email,
        name,
        password,
      });

      res.json(new UserSerializer(user));
    } else {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user && user.active) res.json(new UserSerializer(user));
    else throw new ApiError('User not found', 400);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;
    const {
      username,
      email,
      name,
    } = body;

    if (username || email || name) {
      let user = await User.findOne({ where: { id: params.id } });
      if (user && user.active) {
        user = await User.update({ where: { id: params.id } }, body);
        res.json(new UserSerializer(user));
      } else {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.update({ where: { id: params.id } }, { active: false });
    if (user != null) res.json(new UserSerializer(null));
    else throw new ApiError('User not found', 400);
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
