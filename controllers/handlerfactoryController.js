let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');
let APIFeatures = require('./../utils/apiFeatures');

// Create One
exports.createOne = Model => 
  catchAsync(async (req, res, next) => {
    let doc = await Model.create(req.body);
    // Send response
    res.status(201).json({
        status: "ok",
        requestTime: req.requestTime,
        data: {
          data: doc
        }
    })
  });

// Get All
exports.getAll = Model => 
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.param.tourId) filter = { tour: req.params.tourId };

    // Base Query: query.sort().select().skip().limit()
    let features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //let doc = await features.query.explain(); // Indexing (First read document)
    let doc = await features.query;

    // Send response
    res.status(200).json({
        status: "ok",
        requestTime: req.requestTime,
        length: doc.length,
        data: {
          data: doc
        }
    })
  });

// Get One  
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    let doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404)); 
    }

    // Send response
    res.status(200).json({
        status: "ok",
        requestTime: req.requestTime,
        data: {
          data: doc
        }
    })
  });

// Update One  
exports.updateOne = Model => 
  catchAsync(async (req, res, next) => {  
    let doc = await Model.findByIdAndUpdate(
      req.params.id, 
      req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404)); 
    }

    // Send response
    res.status(200).json({
        status: "ok",
        requestTime: req.requestTime,
        data: {
          data: doc
        }
    })
  });

// Delete One
exports.deleteOne = Model => 
  catchAsync(async (req, res, next) => {
    let doc = await Model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError('No document found with that ID', 404)); 
    }
  
    // Send response
    res.status(204).json({
        status: "ok",
        data: null
    })
  });