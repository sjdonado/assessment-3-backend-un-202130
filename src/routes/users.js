const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');

router.post('/', UsersController.createUser);

router.get('/:id', UsersController.getUserById);

router.put('/:id', UsersController.updateUser);

router.delete('/:id', UsersController.desactivateUser);

module.exports = router;
