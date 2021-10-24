const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.username == null || body.email == null || body.name == null || body.password == null) {
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
    const { params, body } = req;
    const user = await User.findOne({ where: { id: params.id } });
    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }
    if (Object.keys(body).length === 0) {
      res.json(new UserSerializer(user));
    } else {
      if ((body.username == null && body.email == null && body.name == null) || body.password != null) {
        throw new ApiError('Payload can only contain username, email or name', 400);
      }
      const userUpdate = await User.update({ where: { id: params.id } }, { username: body.username, email: body.email, name: body.name });
      res.json(new UserSerializer(userUpdate));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUserById,
};
