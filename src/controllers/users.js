const ApiError = require('../utils/ApiError');

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
const desactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    let user = await User.findOne({ where: { id: params.id } });
    if (!user || !user.active) {
      throw new ApiError('User not found', 400);
    }
    user = await User.update({ where: { id: params.id } }, {
      active: false,
    });
    res.json({ status: 'success', data: null }).status(200);
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { params } = req;
    let user = await User.findOne({ where: { id: params.id } });
    if (Object.keys(body).some((val) => val !== 'name' && val !== 'username' && val !== 'email')) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }
    if (!user || !user.active) {
      throw new ApiError('User not found', 400);
    }
    user = await User.update({ where: { id: user.id } }, body);

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

module.exports = {
  createUser,
  getUserById,
  updateUser,
  desactivateUser,
};
