const ApiError = require('../utils/ApiError');
const UserSerializer = require('../serializers/UserSerializer');
const User = require('../models/user');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    });
    const response = user ? {
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,

        email: user.email,
        createdAt: user.createdAt,
        updatedAt: new Date(),
        lastLoginDate: user.lastLoginDate,
        password: undefined,
        passwordConfirmation: undefined,
      },
    } : {
      status: 'error',
      data: null,
    };

    res.json(new UserSerializer(user));
    // res.status(user ? 200 : 400).json(response);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const us = await User.findOne({ where: { id: params.id } });
    if (us == null || us?.active === false) {
      throw new ApiError('User not found', 400);
    }
    const user = await User.findOne({ where: { id: params.id } });
    const response = user ? {
      status: 'success',
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.update,
        lastLoginDate: null,
        password: undefined,
        active: undefined,
      },
    } : {
      status: 'User not found',
      data: null,
    };
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body, params } = req;

    const us = await User.findOne({ where: { id: params.id } });
    if (us == null || us?.active === false) {
      throw new ApiError('User not found', 400);
    }

    const user = await User.update({ where: { id: params.id } }, {
      username: body.username,
      name: body.name,
      email: body.email,
    });

    const response = user ? {
      status: 'success',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: new Date(),
        lastLoginDate: user.lastLoginDate,
      },
    } : {
      status: 'User not found',
      data: null,
    };
    res.json(new UserSerializer(user));
    // res.status(user ? 200 : 400).json(response);
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { body, params } = req;
    const user = await User.update({ where: { id: params.id } }, {
      active: false,

    });
    if (user == null) {
      throw new ApiError('User not found', 400);
    }

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
