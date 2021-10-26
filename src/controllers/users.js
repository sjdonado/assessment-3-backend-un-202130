const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

function ThrowError(msg, code) {
  if (msg !== '') throw new ApiError(msg, code);
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
  finalError.message = '';
  finalError.code = '';

  try {
    const { params } = req;
    const { body } = req;
    const user = await User.findOne({ where: { id: params.id } });

    const dataBody = Object.keys(body);
    const dataUpdate = ['name', 'username', 'email'];

    const payloadValid = dataBody.map((item) => {
      let validData = true;
      if (!dataUpdate.includes(item)) {
        validData = false;
      }
      return validData;
    });

    if (payloadValid.includes(false)) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    if (user === undefined || user.active === false) {
      finalError.message = 'User not found';
      finalError.code = 400;
    }

    ThrowError(finalError.message, finalError.code);

    const newDataUser = await User.update({ where: { id: params.id } }, body);
    res.json(new UserSerializer(newDataUser));
  } catch (err) {
    next(err);
  }
};

const desactiverUser = async (req, res, next) => {
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
  desactiverUser,
};
