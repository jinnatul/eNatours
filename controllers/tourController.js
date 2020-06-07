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

exports.getTourStats = async (req, res) => {
  try {
    let tourStats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
    ]);

    // Send response
    res.status(200).json({
      status: "ok",
      requestTime: req.requestTime,
      data: {
        tourStats
      }
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    let year = req.params.year * 1; // 2021

    let plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      }, 
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }      
    ]);
    // Send response
    res.status(200).json({
      status: "ok",
      requestTime: req.requestTime,
      data: {
        plan
      }
    })
  } catch (err) {
    res.status(404).json({
      success: 'fail',
      message: err
    })
  }
}