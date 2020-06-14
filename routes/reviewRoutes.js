let express = require('express');
let { protect, restrictTo } = require('./../controllers/authController');

let { 
  getAllReviews,
  setTourUserIds, 
  createReview,
  getReview,
  deleteReview,
  updateReview 
} = require('./../controllers/reviewController');

let router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(
    protect, 
    restrictTo('user'), 
    setTourUserIds,
    createReview
  );

 router
    .route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview);


module.exports = router;