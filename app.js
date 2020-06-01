let fs = require('fs');
let express = require('express');
let morgan = require('morgan');

let app = express();
let port = 8000;

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from our Middleware');
  next();
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})


let tours = JSON.parse( 
  fs.readFileSync(`${__dirname}/resources/assets/data/tours-simple.json`)
);

let getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
      status: "ok",
      requestTime: req.requestTime,
      length: tours.length,
      data: {
        tours
      }
    })
}

let getTour = (req, res) => {
  let id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid request'
    })
  }
  let tour = tours.find(el => el.id === id);
  res.status(200).json({
      status: "ok",
      data: {
        tour
      }
    })
}

let createTour = (req, res) => {
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

let updateTour = (req, res) => {
  let id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid request'
    })
  }
  res.status(200).json({
    success: 'ok',
    message: 'Update succes'
  })
}

let deleteTour = (req, res) => {
  let id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid request'
    })
  }
  res.status(204).json({
    success: 'ok',
    data: null
  })
}

app
  .route('/api/v1/tours/')
  .get(getAllTours)
  .post(createTour)

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});