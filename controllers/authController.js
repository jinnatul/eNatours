let User = require('./../models/userModel');
let catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  let newUser = await User.create(req.body);

  res.status(201).json({
    status: 'ok',
    date: {
      newUser
    }
  });
});