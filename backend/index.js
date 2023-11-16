const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const port = process.env.PORT || 5000;

const User = require('./models/user').User;
const app = express();
const cookieParser = require('cookie-parser');


mongoose.connect(
  'mongodb+srv://karthikgowdams27:VsP418YvovfO4Uuj@root-cluster.ppsjecp.mongodb.net/noteDB'
);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://witty-field-0607dc10f.4.azurestaticapps.net/',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 3600000, // Session max age in milliseconds
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Adding Local Strategy to passport
passport.use(User.createStrategy());


// Serializing and Deserializing User
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      email: user.email,
      name: user.name,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });

});

// Routes

const authRouter = require('./routes/auth');
const noteRouter = require('./routes/notes');
app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
