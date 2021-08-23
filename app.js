const express = require('express');

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
