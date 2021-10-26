const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (!(body.password && body.passwordConfirmation && body.username && body.email && body.name)) {
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
    if (!user || user.active === false) {
      throw new ApiError('User not found', 400);
    }
    user.active = undefined;
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const [userId, username, name, email] = [
      req.params.id,
      body.username,
      body.name,
      body.email,
    ];
    const allowedProperties = ['username', 'name', 'email'];
    const bodyProperties = Object.keys(body);
    let badPayload = false;
    bodyProperties.forEach((propertie) => {
      if (!allowedProperties.includes(propertie)) {
        badPayload = true;
      }
    });
    if (badPayload) throw new ApiError('Payload can only contain username, email or name', 400);
    const user = await User.findOne({ where: { id: userId } });
    if (user?.active === false) {
      throw new ApiError('User not found', 400);
    }
    const updatedUser = await User.update({ where: { id: userId } }, {
      username, name, email,
    });
    res.json(new UserSerializer(updatedUser));
  } catch (err) {
    next(err);
  }
};

const desactivateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new ApiError('User not found', 400);
    }
    const updatedUser = await User.update({ where: { id: userId } }, {
      active: false,
    });
    res.json(new UserSerializer(null));
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
