const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/:id', UsersController.getUserById);

router.post('/', UsersController.createUser);

router.put('/:id', UsersController.getUserById);

router.delete('/:id', UsersController.deactivateUser);

module.exports = router;
