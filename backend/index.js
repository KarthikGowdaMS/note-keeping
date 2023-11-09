const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect('mongodb+srv://karthikgowdams27:VsP418YvovfO4Uuj@root-cluster.ppsjecp.mongodb.net/noteDB');

const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model("Note", noteSchema);

app.get('/api/notes', async function (req, res) {
    try {
        const notes = await Note.find({});
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/edit/:id', async function (req, res) {
    const id = req.params.id;
    console.log("here");
    const note = {
        title: req.body.title,
        content: req.body.content
    }
    await Note.findByIdAndUpdate(id, note);
    res.send("Note Edited Succesfully");

});

app.post('/api/add', async function (req, res) {
    // console.log(req.body);
    const note = new Note({
        title: req.body.title,
        content: req.body.content
    });
    await note.save();
    res.send("Note added Succesfully");

    // const notes = await Note.find({}).exec();
    // res.json(notes);

});

app.post('/api/delete/:id', async function (req, res) {
    const id = req.params.id;
    // console.log(id);
    try {

        await Note.deleteOne({ _id: id }).exec();
    }
    catch (error) {
        console.log();
    }

    res.send("Note deleted Succesfully");

});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});