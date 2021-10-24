const ApiError = require('../utils/ApiError');
const BaseSerializer = require('../serializers/BaseSerializer');


const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const userData = {
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    };

    if (Object.values(userData).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    const user = await User.create(userData);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};


const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (!user || !user.active) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (!user || !user.active) {
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

const updateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { body } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (!user || !user.active) {
      throw new ApiError('User not found', 400);
    }

    const userData = {
      username: body.username,
      email: body.email,
      name: body.name,
    };

    if (Object.values(userData).some((val) => val === undefined)) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const userUpdate = await User.update(
      { where: { id: params.id } },
      userData,
    );

    res.json(new UserSerializer(userUpdate));
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
