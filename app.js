let express = require('express');
let morgan = require('morgan');
let tourRouter = require('./routes/tourRoutes');
let userRouter = require('./routes/userRoutes');

let app = express();

// Middlewares
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/resources/public`)); // access static content
app.use((req, res, next) => {
  console.log('Hello from our Middleware');
  next();
})
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;