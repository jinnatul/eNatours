let express = require('express');
let { protect, restrictTo } = require('./../controllers/authController');

let { 
  getAllReviews, 
  createReview,
  deleteReview 
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

 router
    .route('/:id')
    .delete(deleteReview);


module.exports = router;