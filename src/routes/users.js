const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req, res, next) => {
  const { body } = req;

  if (body.password !== body.passwordConfirmation) {
    res.json({
      status: 'Passwords do not match',
      data: null,
    }, 400);
    return;
  }

  const user = await User.create({
    username: body.username,
    email: body.email,
    name: body.name,
    password: body.password,
  });

  delete user.password;

  res.json({
    status: 'success',
    data: user,
  });
});

router.get('/:id', async (req, res, next) => {
  const { params } = req;

  if (!params.id) {
    res.json({
      status: 'Invalid param',
      data: null,
    }, 400);
    return;
  }

  const user = await User.getbyId(params.id);

  delete user.password;

  res.json({
    status: 'success',
    data: user,
  });
});

module.exports = router;
