//encrypts Oauth keys
require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const MeetupStrategy = require('passport-meetup').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const keys = require('../keys.js');
const User = require('../models/user.js');
//middleware to encrypt passwords
const bCrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const otp=require('../models/otp.js');


// Passport session setup
passport.serializeUser(function (user, done) {
  console.log('user', user, 'done', done);
  if (user) {
    console.log('serialize' + user._id);
    done(null, user._id);
  } else {
    console.log('serialize' + user._id);
    done(null, user._id);
  }
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
  console.log('deserialize' + id);
  User.findById(id).then(function (user) {
    if (user) {
      console.log('deserialize', user);
      done(null, user);
    } else {
      done(user.errors, null);
    }
  });
});

//passport config for local signup
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      process.nextTick(function () {
        User.find({
          email: email,
        }).then(function (user) {
          if (user.length > 0) {
            // console.log('signupMessage', 'That email is already taken.');

            return done(null, false, {
              message: 'That email is already taken.',
            });
          } else {
            const userPassword = generateHash(req.body.password);
            const newUser = {
              name: req.body.name,
              email: req.body.email,
              password: userPassword,
              authMethod: 'local',
              verified: false,
            };
            User.create(newUser).then(function (dbUser) {
              if (!dbUser) {
                return done(null, false);
              } else {
                sendotpemail(dbUser.email,dbUser._id);
                return done(null, dbUser);
              }
            });
              // newUser.save().then(
              //   (user) => {
              //     console.log('user', user);
              //     return done(null, user);
              //   },
              //   (err) => {
              //     console.log('err', err);
              //     return done(null, false, { message: 'Something went wrong with your Signin' });
              //   },
              //   (result)=>{
              //     sendotpemail(result,res);
              //   }
                  
              // );
          }
        });
      });
    }
  )
);

// const LocalStrategy = require('passport-local').Strategy;

passport.use(
  'local-signin',
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        const isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };

        if (!user) {
          return done(null, false, { message: 'User does not exist.' });
        }
        console.log('user', user);

        if (!isValidPassword(user.password, password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(null, false, {
          message: 'Something went wrong with your Signin.',
        });
      }
    }
  )
);

//passport config for local signin
// passport.use(
//   'local-signin',
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//       passReqToCallback: true, // allows us to pass back the entire request to the callback
//     },
//     function (req, email, password, done) {
//       const isValidPassword = function (userpass, password) {
//         return bCrypt.compareSync(password, userpass);
//       };

//       User.find({
//         email: email,
//       })
//         .then(function (user) {
//           console.log('user', user[0]);
//           if (user[0].length <= 0) {
//             console.log("'Email does not exist'");
//             return done(null, false, {});
//           }
//           if (!isValidPassword(user[0].password, password)) {
//             console.log('yo?');
//             return done(null, false, {
//               message: 'Incorrect password.',
//             });
//           }
//           return done(null, user);
//         })
//         .catch(function (err) {
//           console.log('Error:', err);
//           return done(null, false, {
//             message: 'Something went wrong with your Signin',
//           });
//         });
//     }
//   )
// );

//passport config for google signin
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // console.log("Email: " + profile.emails[0].value);
      // console.log("ID: " + profile.id);
      // console.log("Display name: " + profile.displayName);
      // console.log("given name: " + profile.name.givenName);
      // console.log("google passport callback");

      //done(null, { id: profile.id });
      process.nextTick(async function () {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          let Iduser = await User.findOne({ socialID: profile.id });
          if (!Iduser) {
            user.socialID = profile.id;
            user.authMethod = 'google';

            const dbUser = await user.save();
            if (!dbUser) {
              return done(null, false);
            } else {
              console.log(dbUser.dataValues);
              return done(null, dbUser);
            }
          } else {
            console.log('Already signed in.');
            return done(null, user);
          }
        } else {
          User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            authMethod: 'google',
            socialID: profile.id,
          }).then(function (dbUser, created) {
            if (!dbUser) {
              return done(null, false);
            } else {
              // console.log(dbUser);
              return done(null, dbUser);
            }
          });
        }
      });
    }
  )
);

// //passport config for facebook signin
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.appID,
      clientSecret: keys.facebook.appSecret,
      callbackURL: 'https://note-keeping-backend.karthikgowdams.com/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name'],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      console.log('ID: ' + profile.id);
      console.log('Display name: ' + profile.displayName);
      console.log('fb passport callback');

      process.nextTick(async function () {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          let Iduser = await User.findOne({ socialID: profile.id });
          if (!Iduser) {
            user.socialID = profile.id;
            user.authMethod = 'facebook';

            const dbUser = await user.save();
            if (!dbUser) {
              return done(null, false);
            } else {
              console.log(dbUser.dataValues);
              return done(null, dbUser);
            }
          } else {
            console.log('Already signed in.');
            return done(null, user);
          }
        } else {
          User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            authMethod: 'facebook',
            socialID: profile.id,
          }).then(function (dbUser, created) {
            if (!dbUser) {
              return done(null, false);
            } else {
              console.log(dbUser.dataValues);
              return done(null, dbUser);
            }
          });
        }
      });
    }
  )
);

// // Use the MeetupStrategy within Passport.
// //   Strategies in passport require a `verify` function, which accept
// //   credentials (in this case, a token, tokenSecret, and Meetup profile), and
// //   invoke a callback with a user object.
// passport.use(new MeetupStrategy({
//     consumerKey: keys.meetup.consumerKey,
//     consumerSecret: keys.meetup.consumerSecret,
//     callbackURL: "/auth/meetup/callback"
//   },
//   function(token, tokenSecret, profile, done) {
//     console.log(profile);
//     console.log("ID: " + profile.id);
//     console.log("Display name: " + profile.displayName);
//     console.log("meetup passport callback");
//     // asynchronous verification, for effect...
//     process.nextTick(function () {

//       // To keep the example simple, the user's Meetup profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Meetup account with a user record in your database,
//       // and return that user instead.
//       return done(null, profile);
//     });
//   }
// ));

passport.use(
  new GitHubStrategy(
    {
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret,
      callbackURL: '/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      console.log('ID: ' + profile.id);
      console.log('Display name: ' + profile.displayName);
      console.log('github passport callback');

      process.nextTick(async function () {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          let Iduser = await User.findOne({ socialID: profile.id });
          if (!Iduser) {
            user.socialID = profile.id;
            user.authMethod = 'github';

            const dbUser = await user.save();
            if (!dbUser) {
              return done(null, false);
            } else {
              console.log(dbUser.dataValues);
              return done(null, dbUser);
            }
          } else {
            console.log('Already signed in.');
            return done(null, user);
          }
        } else {
          User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            authMethod: 'github',
            socialID: profile.id,
          }).then(function (dbUser, created) {
            if (!dbUser) {
              return done(null, false);
            } else {
              console.log(dbUser.dataValues);
              return done(null, dbUser);
            }
          });
        }
      });
    }
  )
);

//generate hash for password
function generateHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

async function sendotpemail(email,_id){
  console.log(email);
  const notp=Math.floor(100000 + Math.random() * 900000);



  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mskarthikgowda03@gmail.com',
      pass: 'xwbl pgop wcjm csun',
    },
  });

  const mailOptions = {
    from: 'mskarthikgowda03@gmail.com',
    to: email,
    subject: 'Verify Your Keeper App Account',
    text: `Your OTP is ${notp}`,
    };

const hashedotp= generateHash(notp.toString());

    const newotp=new otp({
      userid:_id,
      email:email,
      otp:hashedotp,
      createdAt:Date.now(),
      expiresAt:Date.now()+360000,
    });
    newotp.save();

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}