let Tour = require('./../models/tourModel');

// Middlewares
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.prise) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or prise'
    })
  }
  next();
}

// Requests
exports.getAllTours = (req, res) => {
  res.status(200).json({
      status: "ok",
      requestTime: req.requestTime,
      // length: tours.length,
      // data: {
      //   tours
      // }
    })
}

exports.getTour = (req, res) => {
  let id = req.params.id * 1;
  // let tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //     status: "ok",
  //     data: {
  //       tour
  //     }
  //   })
}

exports.createTour = async (req, res) => {
  /****1 way****/ 
  // let newTour = new Tour({})
  // newTour.save()

  /****Another way****/
  // Tour.create({})

  try {
    let newTour = await Tour.create(req.body);
    res.status(201).json({
        status: "ok",
        data: {
          newTour
        }
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
  
}

exports.updateTour = (req, res) => {  
  res.status(200).json({
    success: 'ok',
    message: 'Update succes'
  })
}

exports.deleteTour = (req, res) => {
  res.status(204).json({
    success: 'ok',
    data: null
  })
}