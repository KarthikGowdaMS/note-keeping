const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// Routes
const authRouter = require('./routes/auth');
const noteRouter = require('./routes/notes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);

mongoose.connect(
  'mongodb+srv://karthikgowdams27:VsP418YvovfO4Uuj@root-cluster.ppsjecp.mongodb.net/noteDB'
);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});