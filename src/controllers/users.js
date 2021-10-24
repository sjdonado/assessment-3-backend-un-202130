const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    let myError = '';
    let myErrorCode = '';

    if (body.password !== body.passwordConfirmation) {
      myError = 'Passwords do not match';
      myErrorCode = 400;
    }

    if (!body.name || !body.username || !body.email || !body.password) {
      myError = 'Payload must contain name, username, email and password';
      myErrorCode = 400;
    }

    if (body.active === false) {
      myError = 'User not found';
      myErrorCode = 400;
    }

    if (myError !== '') {
      throw new ApiError(myError, myErrorCode);
    }

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
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
};
