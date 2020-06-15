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

// Protect all routes after middleware
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(
    restrictTo('user'), 
    setTourUserIds,
    createReview
  );

 router
    .route('/:id')
    .get(getReview)
    .patch(
      restrictTo('user', 'admin'),
      updateReview
    )
    .delete(
      restrictTo('user', 'admin'),
      deleteReview
    );


module.exports = router;