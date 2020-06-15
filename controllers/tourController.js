let Tour = require('./../models/tourModel');
let catchAsync = require('./../utils/catchAsync');
let factory = require('./handlerfactoryController');
let Apperror = require('./../utils/appError');

// Middlewares
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// Requests
exports.createTour = factory.createOne(Tour);
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});

// GeoSpatial Queries finding Tours with Radious
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  let { distance, latlng, unit } = req.params;
  let [lat, lng] = latlng.split(',');

  let radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new Apperror(
        'Please provide latitutr and longitude int the format lat,lng.', 
        400
      )
    );
  }

  let tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    status: 'ok',
    requestTime: req.requestTime,
    length: tours.length,
    data: {
      tours
    }
  });

});