const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: String,
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(findOrCreate);

module.exports = {
  User: mongoose.model('User', userSchema),
  userSchema: userSchema,
};
