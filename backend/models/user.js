const mongoose = require('mongoose');
const { Schema } = mongoose;
// Save a reference to the Schema constructor

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const userSchema = new Schema({
  // `username` must be of type String
  // `username` will trim leading and trailing whitespace before it's saved
  // `username` is a required field and throws a custom error message if not supplied
  name: {
    type: String,
  },
  // `password` must be of type String
  // `password` will trim leading and trailing whitespace before it's saved
  // `password` is a required field and throws a custom error message if not supplied
  // `password` uses a custom validation function to only accept values 6 characters or more
  password: {
    type: String,
    trim: true,
    required: 'Password is Required',
  },
  // `email` must be of type String
  // `email` must be unique
  // `email` must match the regex pattern below and throws a custom error message if it does not
  // You can read more about RegEx Patterns here https://www.regexbuddy.com/regex.html
  email: {
    type: String,
    unique: true,
  },
  authMethod: {
    type: String,
  },
  socialID: {
    type: String,
  },
  // `date` must be of type Date. The default value is the current date
  userCreated: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };
// This creates our model from the above schema, using mongoose's model method
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
