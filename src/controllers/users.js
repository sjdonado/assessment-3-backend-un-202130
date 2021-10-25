const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.name === undefined || body.username === undefined || body.email === undefined) {
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

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined) {
      throw new ApiError('User not found', 400);
    }

    if (user.active === false) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { params } = req;

    if (body.password !== undefined || body.passwordConfirmation !== undefined) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    if (body.name === undefined && body.username === undefined && body.email === undefined) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const user = await User.update(
      {
        where: { id: params.id },
      },
      {
        username: body.username,
        email: body.email,
        name: body.name,
      },
    );

    if (user.active === false) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { params } = req;

    const tempUser = await User.findOne({ where: { id: params.id } });

    if (tempUser === undefined || tempUser === null) {
      throw new ApiError('User not found', 400);
    }

    const user = await User.update(
      {
        where: { id: params.id },
      },
      {
        active: false,
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
  updateUser,
  deleteUser,
};
