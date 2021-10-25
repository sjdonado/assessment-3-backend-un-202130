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

    const ErrorMenssage = 'Payload must contain name, username, email and password';
    const ErrorCode = 400;

    const Confirmar = confimacionNuevoUsario(UserName, Contraseña, nameU , Email)

    if (Confirmar) {
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

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    const ErrorMenssage = 'User not found';
    const ErrorCode = 400;
    if (!user) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
    if (!user.active) {
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

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    if (!user) {
      Conf1 = true
      existeUsuario(Conf1)
    }
    if (!user.active) {
      Conf2 = true
      existeUsuario(Conf2)
    }
    
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};


    
function existeUsuario(Confirmacion){
  const ErrorMenssage = 'User not found';
    const ErrorCode = 400;
    /*Usuario No existe o No esta activado */
    if (Confirmacion) {
      throw new ApiError(ErrorMenssage, ErrorCode);
    }
}

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { params } = req;
    const userFound = await User.findOne({ where: { id: params.id } });
    if (!userFound) {
      conf1 = true;
      existeUsuario(conf1);
    }
    if (!userFound.active) {
      conf2 = true;
      existeUsuario(conf2);
    }

    const Nombre = body.name;
    const Usuario = body.username;
    const Correo = body.email;
    confimacionActualizarUsario(Usuario, Nombre, Correo)
    res.json(new UserSerializer(await User.update({ where: { id: params.id } } , {name: Nombre,username: Usuario,email: Correo,})));
  } catch (err) {
    next(err);
  }
};

function confimacionActualizarUsario(Usuario, Nombre, Correo){
  const ErrorMenssage2 = 'Payload can only contain username, email or name';
  const ErrorCode2 = 400;
  if(!Nombre && !Usuario && !Correo){
    throw new ApiError(ErrorMenssage2, ErrorCode2);
  }
}

function confimacionNuevoUsario(Usuario, Contraseña,Nombre, Email){
  var s1=false, s2=false, s3=false, s4=false;
  var confirmacion = false;
  if(!Usuario){
    /*No tiene Usuario*/
    s1 = true;
  }
  if(!Contraseña){
    /*No tiene Contraseña*/
    s2 = true;
  }
  if(!Nombre){
    /*No tiene Nombre*/
    s3 = true
  }
  if(!Email){
    /*No tiene Email*/
    s4 = true;
  }
  if(s1 || s2 || s3 || s4){
    confirmacion = true
  }
  return confirmacion
}

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
};
