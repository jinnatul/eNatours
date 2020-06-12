let crypto = require('crypto');
let mongoose = require('mongoose');
let validator = require('validator');
let bcrypt = require('bcryptjs');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!!!'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    let changedTimesTamp = parseInt(
      this.passwordChangedAt.getTime() / 1000, 
      10
    );

    return JWTTimestamp < changedTimesTamp;
  }

  // False mean not change
  return false;
}

userSchema.methods.createPasswordResetToken = function() {
  let resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
    console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    
    return resetToken;
}

let User = mongoose.model('User', userSchema);

module.exports = User;
