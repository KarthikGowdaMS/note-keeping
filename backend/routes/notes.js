const express = require('express');
const noteRouter = express.Router();
const Note = require('../models/note');
const fetchuser = require('../middleware/fetchuser');

noteRouter.get('/', fetchuser, async function (req, res) {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc' });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

noteRouter.post('/add', fetchuser, async function (req, res) {
  // console.log(req.body);
  try {
    const { title, content } = req.body;
    const note = new Note({
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

noteRouter.post('/edit/:id', fetchuser, async function (req, res) {
  try {
    const id = req.params.id;
    let note = await Note.findById(id);
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
    await Note.findByIdAndUpdate(id, note);
    res.send('Note Edited Succesfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

noteRouter.post('/delete/:id', fetchuser, async function (req, res) {
  const id = req.params.id;
  let note = await Note.findById(id);
  if (!note) {
    return res.status(404).send('Note Not Found');
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send('Delete Not Allowed');
  }
  // console.log(id);
  try {
    await Note.deleteOne({ _id: id }).exec();
    res.send('Note deleted Succesfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = noteRouter;