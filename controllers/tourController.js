let fs = require('fs');

let tours = JSON.parse( 
  fs.readFileSync(`${__dirname}/../resources/assets/data/tours-simple.json`)
);

// Middlewares
exports.checkId = (req, res, next, val) => {
  console.log(`id: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid request'
    })
  }
  next();
}

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
      length: tours.length,
      data: {
        tours
      }
    })
}

exports.getTour = (req, res) => {
  let id = req.params.id * 1;
  let tour = tours.find(el => el.id === id);
  res.status(200).json({
      status: "ok",
      data: {
        tour
      }
    })
}

exports.createTour = (req, res) => {
  let newId = tours[tours.length - 1].id + 1;
  let newTour = Object.assign({id: newId}, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/resources/assets/data/tours-simple.json`, 
    JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'ok',
        data: {
          tour: newTour
        }
      })
    })
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