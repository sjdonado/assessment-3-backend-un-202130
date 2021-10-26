const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/:id', UsersController.getUserById);

router.put('/:id', UsersController.updateUser);

router.post('/', UsersController.createUser);

router.delete('/:id', UsersController.desactivateUser);

module.exports = router;
