const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

async function validateAndFindKey(Objectdata) {
  let sw = false;

  if (await Objectdata.find((key) => key === 'username') && await Objectdata.find((key) => key === 'email') && await Objectdata.find((key) => key === 'name')) {
    sw = true;
  }
  if (sw) {
    return true;
  }
  return false;
}

async function validateUndefine(info) {
  let sw = false;

  if (info.name === undefined || info.username === undefined || info.email === undefined) {
    if (info.passwordConfirmation === undefined || info.password === undefined) {
      sw = true;
    }
    sw = true;
  }
  if (sw) {
    throw new ApiError('Payload must contain name, username, email and password', 400);
  }
  return false;
}

const createUser = async (req, res, next) => {
  try {
    const data = req.body;

    if (data.password !== data.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    await validateUndefine(data);

    const dataUserInsert = {
      username: data.username,
      email: data.email,
      name: data.name,
      password: data.password,
      active: true,
    };
    const user = await User.create(dataUserInsert);
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

    if (!user.active) {
      throw new ApiError('User not found', 400);
    }

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const data = req.body;
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined) {
      throw new ApiError('User not found', 404);
    }

    if (!user.active) {
      throw new ApiError('User not found', 400);
    }

    if (await validateAndFindKey(Object.keys(data))) {
      const UserUpdated = await User.update({ where: { id: params.id } }, data);
      res.json(new UserSerializer(UserUpdated));
    } else {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined) {
      throw new ApiError('User not found', 400);
    }

    if (!user.active) {
      throw new ApiError('User not found', 400);
    }

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
