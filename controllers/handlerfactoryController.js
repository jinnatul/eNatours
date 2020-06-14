let catchAsync = require('./../utils/catchAsync');
let AppError = require('./../utils/appError');

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

exports.createOne = Model => 
  catchAsync(async (req, res, next) => {
    let doc = await Model.create(req.body);
    // Send response
    res.status(201).json({
        status: "ok",
        data: {
          data: doc
        }
    })
  });