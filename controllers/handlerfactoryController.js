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

