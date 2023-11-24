const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash-messages');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const app = express();
const passportSetup = require('./config/passport');
const PORT = process.env.PORT || 5000;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

// // Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets

// app.use(express.static("client/build"));

// Add routes, both API and views
// app.use(cors({
//   origin: 'http://localhost:3000',
//   Credentials: true,
// }));
app.use(cookieParser());
app.use(flash());
// app.use(expressValidator(middlewareOptions));

app.use(
  session({
    // name: 'session-id',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      expires: 2592000000,
      httpOnly: false,
    },
  })
);

mongoose.Promise = Promise;
//change this to your own mongo collection
mongoose.connect(
  'mongodb+srv://karthikgowdams27:ukA3eKYhwCCQlGK1@root-cluster.ppsjecp.mongodb.net/noteDB',{useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions. Session expires after 6 months, or when deleted by user
app.use(passport.session());

// enable CORS so that browsers don't block requests.
app.use((req, res, next) => {
  //access-control-allow-origin http://localhost:3000
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.header('Access-Control-Allow-Origin', 'https://note-keeping.karthikgowdams.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

app.use('/auth', authRoutes);
app.use('/api/notes', noteRoutes);
// Start the API server
app.listen(PORT, function () {
  console.log(`API Server now listening on PORT ${PORT}!`);
});
