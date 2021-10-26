const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.username == null
      || body.name == null
      || body.email == null
      || body.password == null
      || body.passwordConfirmation == null) {
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
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user) {
      if (user.active === undefined || user.active) {
        res.json(new UserSerializer(user));
      } else if (user.active === false) {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('User not found', 400);
    }
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;

    if (body.username == null
      || body.email == null
      || body.name == null) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const userUpdated = await User.update({ where: { id: params.id } }, body);

    if (userUpdated) {
      if (userUpdated.active === undefined || userUpdated.active) {
        res.json(new UserSerializer(userUpdated));
      } else if (userUpdated.active === false) {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('User not found', 400);
    }
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user) {
      if (user.active === undefined || user.active) {
        const userDeactivated = await User.update(
          { where: { id: params.id } },
          { active: false },
        );

        res.json(new UserSerializer(null));
      } else {
        throw new ApiError('success', 200);
      }
    } else {
      throw new ApiError('User not found', 400);
    }
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
