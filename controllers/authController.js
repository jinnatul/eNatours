let crypto = require('crypto');
let { promisify } = require('util');
let jwt = require('jsonwebtoken');
let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');
let sendEmail = require('./../utils/email');

let signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

let createSendToken = (user, statusCode, res) => {
  let token = signToken(user._id);

  res.status(statusCode).json({
    status: 'ok',
    token,
    date: {
      user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token, resHeader = req.headers.authorization;

  if (resHeader && resHeader.startsWith('Bearer')) {
    token = resHeader.split(' ')[1];
  }

  if (!token) {
    return next(new AppError(
      'You are not logged in! Please log in to get access', 
      401
    ));
  }
  // Verification token
  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  let currentuser = await User.findById(decoded.id);
  if (!currentuser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist', 
        401
      )
    );
  }

  // Check if user change password after the token was issued
  if (currentuser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    )
  }

  // Grant access to protect route
  req.user = currentuser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action', 
          403
        )
      );
    }
    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on Posted email
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(
      'There is no user with this email address',
      404
    ));
  }

  // Generate the rangom  reset token
  let resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it's to user email
  let resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  let message = `Forget your password ? Submit a Patch request with your new password and passwordConfirm 
  to: ${resetURL}.\nIf you didn't forget your password, please ignore this email !!!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'ok',
      message: 'Token send to your email!'
    });

  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later !!!',
        500
      )
    )
  }
  

});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  let hashedToken =crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    let user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    console.log(user);
  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError(
        'Token is invalid or has expired', 
        400
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  // Update changedPasswordAt property for the user
  // Log the user in, send JWT  
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  let user = await User.findById(req.user.id).select('+password');

  // Check if Posted current password is correct
  if (!(await user.correctPassword( req.body.passwordCurrent, user.password ))) {
    return next(new AppError(
      'Your current password is wrong',
      401
    ));
  }
  // If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  
  // Log user in, send jwt
  createSendToken(user, 200, res);
});