const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');
const BaseSerializer = require('../serializers/BaseSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    const nameU = body.name;
    const UserName = body.username;
    const Email = body.email;
    const Contraseña = body.password;

    if (!nameU || !UserName || !Contraseña || !Email) {
      const ErrorMenssage = 'Payload must contain name, username, email and password';
      throw new ApiError(ErrorMenssage, 400);
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
    const StatusUser = user.active;
    if (!user || StatusUser === false) {
      const ErrorCode = 'User not found or deactivated';
      throw new ApiError(ErrorCode, 400);
    }
    user.active = undefined;
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};
const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    const StatusUser = user.active;
    if (!user || StatusUser === false) {
      const ErrorMenssage = 'User not found or deactivated';
      throw new ApiError(ErrorMenssage, 400);
    }
    const DesactivarUsuario = false;
    await User.update(
      { where: { id: params.id } },
      { active: DesactivarUsuario },
    );

    res.json(new BaseSerializer('success', null));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { body } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (!user || !user.active) {
      const ErrorMenssage = 'User not found or deactivated';
      throw new ApiError(ErrorMenssage, 400);
    }

    const userData = {
      email: body.email,
      name: body.name,
      username: body.username,
    };

    if (Object.values(userData).some((val) => val === undefined)) {
      const ErrorMenssage = 'Payload can only contain username, email or name';
      throw new ApiError(ErrorMenssage, 400);
    }

    const userUpdate = await User.update(
      { where: { id: params.id } },
      userData,
    );

    res.json(new UserSerializer(userUpdate));
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
