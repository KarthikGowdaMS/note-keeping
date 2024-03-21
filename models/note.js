const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: String,
  content: String,
});

module.exports = mongoose.model('Note', noteSchema);