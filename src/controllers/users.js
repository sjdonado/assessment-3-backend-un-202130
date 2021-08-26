const ApiError = require('../utils/ApiError');

const { User } = require('../database/models');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const userPayload = {
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    };

    if (Object.values(userPayload).some((val) => val === undefined)) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    const user = await User.create(userPayload);

    res.json(new UserSerializer(user).toJSON());
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findByPk(Number(params.id));

    if (!user) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user).toJSON());
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
};
