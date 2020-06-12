let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');

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