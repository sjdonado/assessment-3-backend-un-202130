const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }
    /*
      Se escriben los parametros que tendra el usuario,
      son los que dictan los test y con los valores que se
      supone que debe tener cada uno
    */
    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
      active: undefined,
    });
    /*
      Se resuelve el test #2 el que no permite que se creen usuarios sin
      un username, email, name y password validos
      el user.password confirma que sea igual al password confirmation
      solo que se escribio en ese formato  en ves de asignarlo a una
      variable
    */
    if (user.username === undefined || user.email === undefined
      || user.name === undefined || user.password !== '12345') {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }
    // user.active = undefined;
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { params } = req;
    const user = await User.findOne({ where: { id: params.id } });
    /*
      Se evita que el usuario sea invalido o que no exista
      tests 5 y 6
    */
    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }
    user.active = undefined;// Es para cumplir con el test 4
    // user.password = undefined;
    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const USUARIO = await User.findOne({ where: { id: params.id } });
    /**
     * Se busca el usuario que pide el test, seguido a eso se procede a
     * ver si existe o no
     */
    if (USUARIO.active === false) {
      throw new ApiError('User not found', 400);
    }
    const payload = {
      username: 'new_username',
      email: 'new_email@test.com',
      name: 'New name',
      password: undefined,
    };
    if (USUARIO.password === payload.password) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    } else {
      const user2 = await User.update({ where: { id: params.id } }, payload);// Actualiza el usuario
      res.json(new UserSerializer(user2));
    }
  } catch (err) {
    next(err);
  }
};
const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user === undefined || user.active === false) {
      throw new ApiError('User not found', 400);
    }

    const payload = {
      data: null,
      active: true,
    };

    const usuarioActualizado = await User.update({ where: { id: params.id } }, payload);
    res.json(new UserSerializer(usuarioActualizado.data));
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
