let express = require('express');
let { protect, restrictTo } = require('./../controllers/authController');

let { 
  getAllReviews, 
  createReview 
} = require('./../controllers/reviewController');

let router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(
    protect, 
    restrictTo('user'), 
    createReview
  );

module.exports = router;