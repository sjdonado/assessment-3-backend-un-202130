const express = require('express');
const UserSerializer = require('../serializers/UserSerializer');

function checkValidPayload(req, res, next) {
  const { username, name, email } = req.body;
  if (username || name || email) {
    return next();
  }
  return res.status(400).send({
    status: 'Payload can only contain username, email or name',
    data: null,
  });
}
function checkValidPayloadU(req, res, next) {
  const {
    username, name, email, password,
  } = req.body;
  if (username && name && email && password) {
    return next();
  }

  return res.status(400).send({
    status: 'Payload must contain name, username, email and password',
    data: null,
  });
}
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/:id', UsersController.getUserById);

router.put('/:id', checkValidPayload, UsersController.updateUser);
router.delete('/:id', UsersController.deactivateUser);

router.post('/', checkValidPayloadU, UsersController.createUser);

module.exports = router;
