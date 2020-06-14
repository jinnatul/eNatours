let Review = require('./../models/reviewModel');
let catchAsync = require('./../utils/catchAsync');
let factory = require('./handlerfactoryController');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.param.tourId) filter = { tour: req.params.tourId };

  let reviews = await Review.find(filter);

  res.status(200).json({
    status: 'ok',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync (async(req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  let newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'ok',
    data: {
      newReview
    }
  });
});

exports.deleteReview = factory.deleteOne(Review);
