const ApiError = require('../utils/ApiError');
const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    /* Generate error if there is an empty field */
    if (body.username == null || body.email == null || body.name == null
      || body.password == null) {
      throw new ApiError(
        'Payload must contain name, username, email and password', 400,
      );
    }

    /* Generate error if passwords do not match */
    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    /* Create user */
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

    /* Get user */
    const user = await User.findOne({ where: { id: params.id } });

    /* Generate error if user does not exist or is deactivate */
    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    /* If body is empty return user */
    if (Object.keys(body).length === 0) {
      res.json(new UserSerializer(user));
    } else {
      /* If payload does not contain username, email and name. Generate error */
      if ((body.username == null && body.email == null && body.name == null)
      || body.password != null) {
        throw new ApiError(
          'Payload can only contain username, email or name', 400,
        );
      }

      /* Update user */
      const userUpdate = await User.update({ where: { id: params.id } },
        { username: body.username, email: body.email, name: body.name });
      res.json(new UserSerializer(userUpdate));
    }
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    /* Get user and validate it */
    const user = await User.findOne({ where: { id: params.id } });
    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    /* Update active field to false */
    await User.update({ where: { id: params.id } }, { active: false });

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createUser,
  getUserById,
  deactivateUser,
};
