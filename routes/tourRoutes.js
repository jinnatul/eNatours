let express = require('express');
let { 
  getAllTours, 
  createTour, 
  getTour, 
  updateTour, 
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan 
} = require('./../controllers/tourController');

let { 
  protect, 
  restrictTo 
} = require('./../controllers/authController');

let { createReview } = require('./../controllers/reviewController');

let router = express.Router();

//router.param('id', checkId);

router
  .route('/top-5-tours')
  .get(
    aliasTopTours, 
    getAllTours
  );

router
  .route('/tour-stats')
  .get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(getMonthlyPlan);

router
  .route('/')
  .get(
    protect, 
    getAllTours
  )
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(
    protect, 
    restrictTo('admin', 'lead-guide'), 
    deleteTour
  );

router
  .route('/:tourId/reviews')
  .post(
    protect, 
    restrictTo('user'), 
    createReview
  );

module.exports = router;