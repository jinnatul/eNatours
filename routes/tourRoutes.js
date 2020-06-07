let express = require('express');
let { 
  getAllTours, 
  createTour, 
  getTour, 
  updateTour, 
  deleteTour,
  aliasTopTours 
} = require('./../controllers/tourController');

let router = express.Router();

//router.param('id', checkId);

router.route('/top-5-tours')
  .get(aliasTopTours, getAllTours)

router.route('/')
  .get(getAllTours)
  .post(createTour)

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = router;