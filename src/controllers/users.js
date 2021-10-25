const ApiError = require('../utils/ApiError');
const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const deactivateUser = async (req, res, next) => {
  try {
    const DatosUsuario = await User.findOne({ where: { id: req.params.id } });
    const ErrorMenssage = 'User not found';
    const ErrorCode = 400;
    if (!DatosUsuario) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!DatosUsuario.active) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    const DesactivarUsuario = false;
    
    await User.update(
      { where: { id: req.params.id } },
      { active: DesactivarUsuario },
    );

    res.json(new UserSerializer(null));
  } catch (err) {
    next(err);
  }
};


const createUser = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const nameU = req.body.name;
    const UserName = req.body.username;
    const Email = req.body.email;
    const Contraseña = req.body.password;

    const ErrorMenssage = 'Payload must contain name, username, email and password';
    const ErrorCode = 400;

    if (!nameU || !UserName || !Contraseña || !Email) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    res.json(new UserSerializer(await User.create({
      username: UserName,
      email: Email,
      name: nameU,
      password: Contraseña,
      active: true,
    })));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    const ErrorMenssage = 'User not found';
    const ErrorCode = 400;
    if (!user) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!user.active) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};


const updateUser = async (req, res, next) => {
  try {

    const userFound = await User.findOne({ where: { id: req.params.id } });
    const ErrorMenssage = 'User not found';
    const ErrorCode = 400;
    if (!userFound) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!userFound.active) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    const Nombre = req.body.name;
    const Usuario = req.body.username;
    const Correo = req.body.email;
    const ErrorMenssage2 = 'Payload can only contain username, email or name';
    if (!Nombre && !Usuario && !Correo) {
      throw new ApiError(ErrorMenssage2, ErrorCode);
    }

    res.json(new UserSerializer(await User.update({ where: { id: req.params.id } }, {
      name: Nombre,
      username: Usuario,
      email: Correo,
    })));
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
