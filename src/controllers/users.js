const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const data = {
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    };

    if (Object.values(data).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    const user = await User.create(data);
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { params } = req;

    const userFound = await User.findOne({ where: { id: params.id } });
    if (!userFound || !userFound.active) {
      throw new ApiError('User not found', 400);
    }

    if (Object.keys(body).map((e) => {
      if (e !== 'name' && e !== 'username' && e !== 'email') {
        throw new ApiError('Payload can only contain username, email or name', 400);
      }
      return e;
    }));

    const data = {};
    if (body.name) {
      data.name = body.name;
    }
    if (body.username) {
      data.username = body.username;
    }
    if (body.email) {
      data.email = body.email;
    }

    const user = await User.update({ where: { id: params.id } }, data);
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { params } = req;
    const userFound = await User.findOne({ where: { id: params.id } });
    if (!userFound || !userFound.active) {
      throw new ApiError('User not found', 400);
    }

    const user = await User.update({ where: { id: params.id } }, { active: false });
    res.status(200).json({ status: 'success', data: null });
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
  deleteUser,
};
