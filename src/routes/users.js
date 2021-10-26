const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/:id', UsersController.getUserById);

router.post('/', UsersController.createUser);

router.post('/', UsersController.updateUser);

router.post('/', UsersController.deleteUser);

module.exports = router;
