const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

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
      active: undefined,
    });

    if (user.username === undefined || user.email === undefined
      || user.name === undefined || user.password === undefined) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }
    res.json(new UserSerializer(user));
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
    user.active = undefined;
    user.password = undefined;
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const payload = {
      username: 'new_username',
      email: 'new_email@test.com',
      name: 'New name',
    };
    const USUARIO = await User.findOne({ where: { id: params.id } });
    console.log(USUARIO);
    if (USUARIO.active === false) {
      throw new ApiError('User not found', 400);
    }
    if (USUARIO.password === '12345') {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const user = await User.update({ where: { id: params.id } }, payload);

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};
const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }
    const payload = {
      data: null,
      active: false,
    };
    const user2 = await User.update({ where: { id: params.id } }, payload);

    res.json(new UserSerializer(user2));
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
