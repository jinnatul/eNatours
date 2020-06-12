let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');

let filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let users = await User.find();

  // Send response
  res.status(200).json({
      status: "ok",
      length: users.length,
      data: {
        users
      }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error when user try to change password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(
      'This route is not for Password updates. Please use /updateMyPassword.',
      400
    ));
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  let filteredBody = filterObj(req.body, 'name', 'email');

  // Update user document
  let updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'ok',
    data: {
      updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'ok',
    data: null
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not define'
  });
}

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not define'
  });
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not define'
  });
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not define'
  });
}