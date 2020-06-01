let express = require('express');
let { 
  getAllTours, 
  createTour, 
  getTour, 
  updateTour, 
  deleteTour,
  checkId,
  checkBody 
} = require('./../controllers/tourController');

let router = express.Router();

router.param('id', checkId);

router.route('/')
  .get(getAllTours)
  .post(checkBody ,createTour)

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = router;