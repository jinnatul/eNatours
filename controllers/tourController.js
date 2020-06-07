let Tour = require('./../models/tourModel');

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
    /***** 1st way ******/
    // let tours = await Tour.find()
    //   .where('duration').equals(5)
    //   .where('difficulty').equals('easy');

    /***** 2nd way ******/
    //let tours = await Tour.find({ duration: 5, difficulty: 'easy' });

    // Build Query
    // 1A) Filtering  /api/v1/tours?duration=5&difficulty=easy&page=2
    let queryObj = {...req.query};
    let filterObj = ['page', 'sort', 'limit', 'fields']
    filterObj.forEach(el => delete queryObj[el]); 

    // 1B) Advance Filtering  /api/v1/tours?duration[gte]=5&difficulty=easy&page=2
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting  /api/v1/tours?sort=price
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }
    else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting  /api/v1/tours?fields=name,duration,difficulty,price
    if (req.query.fields) {
      let fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    else {
      query = query.select('-__v');
    }
    
    // 4) Pagination /api/v1/tours?page=1&limit=3
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 10;
    let skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      let numTours = await Tour.countDocuments();
      if (skip > numTours) throw new Error('This page does not exist');
    }

    // Execute query
    // Base Query: query.sort().select().skip().limit()
    let tours = await query;

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