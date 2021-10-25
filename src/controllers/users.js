const ApiError = require('../utils/ApiError');
const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const ErrorMenssage1 = 'Payload must contain name, username, email and password';
const ErrorMenssage2 = 'Payload can only contain username, email or name';
const ErrorMenssage = 'User not found';
const ErrorCode = 400;
// Todas las verificaciones se realizan aca.
function VerificacionData(Data, type) {
  switch (type) {
    case 1:
      // El usuario nuevo no contiene name, username, email o contraseña.
      if (!Data) {
        throw new ApiError(ErrorMenssage1, ErrorCode);
      }
      break;
    case 2:
      // El usuario actualizado necesita usename, email o name.
      if (!Data) {
        throw new ApiError(ErrorMenssage2, ErrorCode);
      }
      break;
    case 3:
      // No existen datos del usuario.
      if (!Data) {
        throw new ApiError(ErrorMenssage, ErrorCode);
      }
      break;
    case 4:
      // El usuario no se encuentra activado
      if (Data !== true) {
        throw new ApiError(ErrorMenssage, ErrorCode);
      }
      break;
    default:
      break;
  }
}

let i;
const deactivateUser = async (req, res, next) => {
  try {
    const DatosUsuario = await User.findOne({ where: { id: req.params.id } });
    const s = false;
    const t3 = 3;
    const t4 = 4;
    // Se confirma que existe el usuario
    VerificacionData(DatosUsuario, t3);
    // Se confirma que el usuario se enecuentre activo == true
    VerificacionData(DatosUsuario.active, t4);
    // Desactivamos el Usuario
    await User.update(
      { where: { id: req.params.id } },
      { active: s },
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
    // Almacenamos los datos de nuevos Usuarios
    const DataNewUser = [req.body.name, req.body.username, req.body.email, req.body.password];
    let c = 0;
    const type = 1;
    // Verificamos que esten completos
    while (c !== DataNewUser.length) {
      VerificacionData(DataNewUser[c], type);
      c += 1;
    }
    res.json(new UserSerializer(await User.create({
      name: DataNewUser[0],
      username: DataNewUser[1],
      email: DataNewUser[2],
      password: DataNewUser[3],
      active: true,
    })));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const DatosUsuario = await User.findOne({ where: { id: req.params.id } });
    // Tipo de verificacion
    const t3 = 3;
    const t4 = 4;
    // Se confirma que existe el usuario
    VerificacionData(DatosUsuario, t3);
    // Se confirma que el usuario se enecuentre activo == true
    VerificacionData(DatosUsuario.active, t4);
    res.json(new UserSerializer(DatosUsuario));
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const DatosUsuario = await User.findOne({ where: { id: req.params.id } });
    // Tipo de verificacion
    const t3 = 3;
    const t4 = 4;
    // Se confirma que existe el usuario
    VerificacionData(DatosUsuario, t3);
    // Se confirma que el usuario se enecuentre activo == true
    VerificacionData(DatosUsuario.active, t4);
    // Se almacenan los datos a actualizar
    const DataUser = [req.body.name, req.body.username, req.body.email];
    let c = 0;
    const type = 2;
    // Verificacion de datos a actualizar existan
    while (c !== DataUser.length) {
      VerificacionData(DataUser[c], type);
      c += 1;
    }
    res.json(new UserSerializer(await User.update({ where: { id: req.params.id } }, {
      // Se envian datos actualizados
      name: DataUser[0],
      username: DataUser[1],
      email: DataUser[2],
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
