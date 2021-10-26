const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    if (!Object.keys(body).includes('name', 'username', 'email', 'password')) {
      throw new ApiError(
        'Payload must contain name, username, email and password',
        400,
      );
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

    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
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
    const user = await User.findOne({ where: { id: params.id } });

    const data = Object.keys(body);
    const toUpdate = ['name', 'username', 'email'];

    const isValid = data.map((item) => {
      let valid = true;

      if (!toUpdate.includes(item)) {
        valid = false;
      }

      return valid;
    });

    if (!isValid) {
      throw new ApiError(
        'Payload can only contain username, email or name',
        400,
      );
    }

    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    const userUpdated = await User.update({ where: { id: params.id } }, body);
    res.json(new UserSerializer(userUpdated));
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

    const data = {
      status: 'success',
      data: null,
    };

    user.active = false;
    User.update({ where: { id: params.id } }, user);
    res.json(data);
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
