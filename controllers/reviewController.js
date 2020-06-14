let Review = require('./../models/reviewModel');
let catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let reviews = await Review.find();

  res.status(200).json({
    status: 'ok',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync (async(req, res, next) => {
  let newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'ok',
    data: {
      newReview
    }
  });
});