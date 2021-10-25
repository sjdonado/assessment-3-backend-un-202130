const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.name === undefined || body.username === undefined || body.email === undefined || body.password === undefined || body.passwordConfirmation === undefined || Object.keys(body).lenght > 5) {
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
      active: true,
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

    if (user === undefined) {
      throw new ApiError('User not found', 400);
    }

    if (user.active === false) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body, params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined) {
      throw new ApiError('User not found', 404);
    }

    if (user.active === false) {
      throw new ApiError('User not found', 400);
    }

    if (await validateKeys(Object.keys(body)) === true) {
      const updatedUser = await User.update({ where: { id: params.id } }, body);
      res.json(new UserSerializer(updatedUser));
    } else {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

  } catch (err) {
    next(err);
  }
}

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined) {
      throw new ApiError('User not found', 400);
    }

    if (user.active === false) {
      throw new ApiError('User not found', 400);
    }

    await User.update({ where: { id: params.id } }, { active: false });

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
}

async function validateKeys(bodyKeys) {
  let counter = 0;

  if (await bodyKeys.find(key => key === 'username')) {
    counter = counter + 1;
  }

  if (await bodyKeys.find(key => key === 'email')) {
    counter = counter + 1;
  }

  if (await bodyKeys.find(key => key === 'name')) {
    counter = counter + 1;
  }

  if (counter === bodyKeys.length && (bodyKeys.length < 4 && bodyKeys.length > 0)) {
    return true;
  }

  return false;
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deactivateUser
};
