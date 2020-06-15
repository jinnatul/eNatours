let fs = require('fs');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let Tour = require('../../../models/tourModel');
let User = require('../../../models/userModel');
let Review = require('../../../models/reviewModel');

dotenv.config({ path: './env/config.env' });

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

 // Read JSON file
let tours = JSON.parse(
  fs.readFileSync( `${__dirname}/tours.json`, 'utf-8')
);
let users = JSON.parse(
  fs.readFileSync( `${__dirname}/users.json`, 'utf-8')
);
let reviews = JSON.parse(
  fs.readFileSync( `${__dirname}/reviews.json`, 'utf-8')
);

// Import data into Tour collection
let importTourData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Tour Data Import Successfull');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

// Delete data from Tour collection
let deleteTourData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Tour Data Delete Successfull');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

if (process.argv[2] === '--import') {
  importTourData();
}
else if (process.argv[2] === '--delete') {
  deleteTourData();
}