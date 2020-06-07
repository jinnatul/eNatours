let Tour = require('./../models/tourModel');
let APIFeatures = require('./../utils/apiFeatures');

// Middlewares
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// Requests
exports.getAllTours = async (req, res) => {
  try {
    // Execute query
    // Base Query: query.sort().select().skip().limit()
    let features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    let tours = await features.query;

    // Send response
    res.status(200).json({
        status: "ok",
        requestTime: req.requestTime,
        length: tours.length,
        data: {
          tours
        }
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    let tour = await Tour.findById(req.params.id);
    //let tour = await Tour.findOne({ _id: req.params.id })

    // Send response
    res.status(200).json({
        status: "ok",
        requestTime: req.requestTime,
        data: {
          tour
        }
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
}

exports.createTour = async (req, res) => {
  /****1 way****/ 
  // let newTour = new Tour({})
  // newTour.save()

  /****Another way****/
  // Tour.create({})

  try {
    let newTour = await Tour.create(req.body);

    // Send response
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

exports.updateTour = async (req, res) => {  
  try {
    let tour = await Tour.findByIdAndUpdate(
      req.params.id, 
      req.body, {
      new: true,
      runValidators: true
    });

    // Send response
    res.status(200).json({
        status: "ok",
        requestTime: req.requestTime,
        data: {
          tour
        }
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // Send response
    res.status(204).json({
        status: "ok",
        requestTime: req.requestTime,
        data: null
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
}