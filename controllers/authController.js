let jwt = require('jsonwebtoken');
let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  res.status(201).json({
    status: 'ok',
    token,
    date: {
      newUser
    }
  });
});