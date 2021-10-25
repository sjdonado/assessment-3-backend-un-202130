const ApiError = require('../utils/ApiError');

const User = require('../models/user');
const UserSerializer = require('../serializers/UserSerializer');
const BaseSerializer = require('../serializers/BaseSerializer');

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    let nameU = body.name
    let UserName = body.username
    let Email = body.email
    let password = body.password
    if(!nameU || !UserName || !password || !Email){
      let ErrorMenssage = 'Payload must contain name, username, email and password';
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
    //Verificamos la existecia y que el usuario a su vez este activado
    let StatusUser = user.active
    if(!user || StatusUser === false){
      let ErrorCode = 'User not found or deactivated'
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
    //Verificamos la existecia y que el usuario a su vez este activado
    let StatusUser = user.active
    if(!user || StatusUser === false){
      let ErrorMenssage = 'User not found or deactivated'
      throw new ApiError(ErrorMenssage, 400);
    }
    DesactivarUsuario = false
    await User.update({where: {id: user.id}}, {active: DesactivarUsuario})


    res.json(new BaseSerializer('success',null));
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createUser,
  getUserById,
  //updateUser,
  deactivateUser,
};