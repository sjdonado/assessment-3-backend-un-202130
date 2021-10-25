const ApiError = require('../utils/ApiError');
const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const nameU = body.name;
    const UserName = body.username;
    const Email = body.email;
    const Contraseña = body.password;

    if (!nameU || !UserName || !Contraseña || !Email) {
      const ErrorMenssage = 'Payload must contain name, username, email and password';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
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
    if (!user) {
      const ErrorMenssage = 'User not found';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!user.active) {
      const ErrorMenssage = 'User not found';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    if (!user) {
      const ErrorMenssage = 'User not found';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!user.active) {
      const ErrorMenssage = 'User not found';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    const DesactivarUsuario = false;

    await User.update(
      { where: { id: params.id } },
      { active: DesactivarUsuario },
    );

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { params } = req;

    const userFound = await User.findOne({ where: { id: params.id } });
    if (!userFound) {
      const ErrorMenssage = 'User not found';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!userFound.active) {
      const ErrorMenssage = 'User not found';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }

    const Nombre = body.name;
    const Usuario = body.username;
    const Correo = body.email;

    if (!Nombre && !Usuario && !Correo) {
      const ErrorMenssage = 'Payload can only contain username, email or name';
      const ErrorCode = 400;
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    const UserD = {
      name: Nombre,
      username: Usuario,
      email: Correo,
    };

    const UdateUser = await User.update({ where: { id: params.id } }, UserD);
    res.json(new UserSerializer(UdateUser));
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