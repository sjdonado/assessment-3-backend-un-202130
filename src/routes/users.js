const express = require('express');

const router = express.Router();

const UsersController = require('../controllers/users');
//Primer Envio sin cambios
router.get('/:id', UsersController.getUserById);

router.post('/', UsersController.createUser);
//Agregar desactivar y actualizar Usuarios
router.delete('/:id', UsersController.deactivateUser);
router.put('/:id', UsersController.updateUser);

module.exports = router;
