const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');
const BaseSerializer = require('../serializers/BaseSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const userParams = {
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    };

    Object.values(userParams).forEach((value) => {
      if (value === undefined) {
        throw new ApiError('Payload must contain name, username, email and password', 400);
      }
    });

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

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { params } = req;

    Object.keys(body).forEach((key) => {
      if (key !== 'name' && key !== 'username' && key !== 'email') {
        throw new ApiError('Payload can only contain username, email or name', 400);
      }
    });

    let user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    user = await User.update({ where: { id: params.id } }, {
      username: body.username,
      email: body.email,
      name: body.name,
    });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    await User.update({ where: { id: params.id } }, {
      active: false,
    });

    res.json(new BaseSerializer('success', null));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
  deleteUser,
  updateUser,
};
