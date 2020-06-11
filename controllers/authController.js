let jwt = require('jsonwebtoken');
let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');

let signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  let token = signToken(newUser._id);

  res.status(201).json({
    status: 'ok',
    token,
    date: {
      newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  // Check email and password exist
  if (!email || !password) {
    next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists & password is correct
  let user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // If everything is ok, then send token to client
  let token = signToken(user._id);
  res.status(200).json({
    status: 'ok',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token, resHeader = req.headers.authorization;
  if (resHeader && resHeader.startWith('Bearer')) {
    token = resHeader.split(' ')[1];
  }

  console.log(token);
  if (!token) {
    return next(new AppError(
      'You are not logged in! Please log in to get access', 
      401
    ));
  }
  // Verification token

  // Check if user still exists

  // Check if user change password after the token was issued

  next();
});