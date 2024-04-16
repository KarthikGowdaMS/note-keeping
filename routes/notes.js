const express = require('express');
const noteRouter = express.Router();
// const Note = require('../models/note');
// import authenticated
const authenticated=require('../middleware/ensureAuthenticated.js');
const mongoose = require('mongoose');
const User = require('../models/user.js');

const { Schema } = mongoose;

const noteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: String,
  content: String,
});

// const Note= mongoose.model('', noteSchema);
noteRouter.get('/', authenticated, async function (req, res) {
  try {
    console.log(req.user.id);

    const user=await User.findById(req.user.id).exec();
    const name=user.name;
    const notes = await mongoose.model(name, noteSchema,name).find({ user: req.user.id }).exec();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

noteRouter.post('/add', authenticated, async function (req, res) {
  // console.log(req.body);
  try {
    const { title, content } = req.body;

    const user= await User.findOne({ _id: req.user.id }).exec();
    console.log(user); 
    const name=user.name;

    const note = new mongoose.model(name,noteSchema,name)({
      title,
      content,
      user: req.user.id,
    });

    const savednote = await note.save();
    res.json(savednote);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

noteRouter.post('/edit/:id', authenticated, async function (req, res) {
  try {
    const id = req.params.id;
    const userid=req.user.id;
    const user=await User.findById(userid).exec();
    const name=user.name;
    let note = await mongoose.model(name,noteSchema,name).findById(id);

    if (!note) {
      return res.status(404).send('Note Not Found');
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Edit Not Allowed');
    }

    const { title, content } = req.body;

    note = {
      title: title,
      content: content,
    };
    //  console.log(note);
    await mongoose.model(name,noteSchema,name).findByIdAndUpdate(id, note);
    res.send('Note Edited Succesfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

noteRouter.post('/delete/:id', authenticated, async function (req, res) {
  const id = req.params.id;
  const userid=req.user.id;
  const user=await User.findById(userid).exec();
  const name=user.name;
  let note = await mongoose.model(name,noteSchema,name).findById(id);

  if (!note) {
    return res.status(404).send('Note Not Found');
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send('Delete Not Allowed');
  }
  // console.log(id);
  try {
    await mongoose.model(name,noteSchema,name).findByIdAndDelete(id);
    res.send('Note deleted Succesfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = noteRouter;
