const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const {
      username,
      email,
      name,
      password,
      passwordConfirmation,
    } = body;

    if (password !== passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    if (!username || !email || !name || !password) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    const user = await User.create({
      username,
      email,
      name,
      password,
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

    if (!user || !user?.active) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {
      params: { id },
      body,
    } = req;

    let user = await User.findOne({ where: { id } });

    if (!user || !user?.active) {
      throw new ApiError('User not found', 400);
    }

    const options = ['username', 'email', 'name'];

    Object.keys(body).forEach((key) => {
      if (!options.includes(key)) throw new ApiError('Payload can only contain username, email or name', 400);
    });

    user = await User.update({ where: { id } }, body);
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    if (!user || !user?.active) throw new ApiError('User not found', 400);

    await User.update({ where: { id: params.id } }, { active: false });
    res.json(new UserSerializer(null));
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
