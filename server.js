let mongoose = require('mongoose');
let dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
let app = require('./app');

//console.log(app.get('env')) // development
let db = process.env.DATABASE.replace(
  '<password>', 
  process.env.DATABASE_PASSWORD
)

mongoose
  .connect(process.env.DATABASE_LOCAL, { 
  //.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false 
 }).then(()  => console.log('DB connect successfull'));

 let tourSchema = new mongoose.Schema({
   name: {
     type: String,
     required: [true, 'A tour must have a name'],
     unique: true
   },
   rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
 });
let Tour = mongoose.model('Tour', tourSchema);

let testTour = new Tour({
  name: 'Sajek vally 2',
  price: 400
});

testTour.save().then(doc => console.log(doc))
.catch(err => console.log(err))

let port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});