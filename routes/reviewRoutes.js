let express = require('express');
let { protect, restrictTo } = require('./../controllers/authController');

let { 
  getAllReviews,
  setTourUserIds, 
  createReview,
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
    .patch(updateReview)
    .delete(deleteReview);


module.exports = router;