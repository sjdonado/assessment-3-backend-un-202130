const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

function ThrowError(message, code) {
  if (message !== '') throw new ApiError(message, code);
}

const finalError = {
  message: '',
  code: '',
};

const createUser = async (req, res, next) => {
  finalError.message = '';
  finalError.code = '';
  try {
    const { body } = req;
    // const bodyKeys = Object.keys(body);
    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }
    if (Object.keys(body).includes('name', 'username', 'email', 'password')) {
      // payload completed
    } else {
      finalError.message = 'Payload must contain name, username, email and password';
      finalError.code = 400;
    }
    ThrowError(finalError.message, finalError.code);

    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    });

    user.active = undefined;

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  finalError.message = 'User not found';
  finalError.code = 400;

  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.active === false) {
      ThrowError(finalError.message, finalError.code);
    }

    user.active = undefined;

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
};
