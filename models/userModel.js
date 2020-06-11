let mongoose = require('mongoose');
let validator = require('validator');

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!!!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!']
  }
});

let User = mongoose.model('User', userSchema);

module.exports = User;
