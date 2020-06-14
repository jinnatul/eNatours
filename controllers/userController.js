let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');
let factory = require('./handlerfactoryController');

let filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el))
      newObj[el] = obj[el];
  });
  return newObj;
}

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

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This Route is Not define! Please use /signup instead.'
  });
}

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User); // Don't update password with this
exports.deleteUser = factory.deleteOne(User);