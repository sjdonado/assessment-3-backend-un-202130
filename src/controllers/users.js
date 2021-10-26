const ApiError = require('../utils/ApiError');
const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const {
      username, email, name, password,
    } = body;

    if (username == null || email == null || name == null || password == null) {
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
    });
    let response;
    let codeStatus;

    if (user != null) {
      response = {
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
      };
      codeStatus = 200;
    } else {
      response = {
        status: 'error',
        data: null,
      };
      codeStatus = 400;
    }
    res.json(response).status(codeStatus);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    let response;
    let codeStatus;
    const user = await User.findOne({ where: { id: params.id } });

    if (user != null && user.active === false) {
      throw new ApiError('User not found', 400);
    }

    if (user != null) {
      response = {
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
      };
      codeStatus = 200;
    } else {
      throw new ApiError('User not found', 400);
    }

    res.json(response).status(codeStatus);
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { body, params } = req;
    const { username, email, name } = body;
    const user = await User.findOne({ where: { id: params.id } });

    if (user !== null && user.active !== true) {
      throw new ApiError('User not found', 400);
    }

    if (username == null || email == null || name == null) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    let user2;
    if (user != null) {
      user2 = await User.update({ where: { id: params.id } }, {
        username: body.username,
        name: body.name,
        email: body.email,
      });
    }

    let codeStatus;
    let response;
    if (user) {
      response = {
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
      };

      codeStatus = 200;
    } else {
      response = {
        status: 'User not found',
        data: null,
      };
      codeStatus = 400;
    }
    res.json(response).status(codeStatus);
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { body, params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user != null) {
      user.active = false;
    } else {
      throw new ApiError('User not found', 400);
    }
    res.json({ status: 'success', data: null }).status(200);
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
