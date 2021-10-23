const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');

router.post('/', UsersController.createUser);
//router.get('/', UsersController.getAllUser);

router.get('/:id', UsersController.getUserById);
router.patch('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);

module.exports = router;
