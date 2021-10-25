const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/:id', UsersController.getUserById);
router.delete('/:id', UsersController.deactivateUser);
router.put('/:id', UsersController.updateUser);
router.post('/', UsersController.createUser);

module.exports = router;
