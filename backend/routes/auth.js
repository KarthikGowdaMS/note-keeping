const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user.js');
const ensureAuthenticated = require('../middleware/ensureAuthenticated.js');

// router.get('/user' ,async (req, res) => {

//   const id = req.session.passport.user;

//   // call db and find user by currenUser which is user id
//   // get username and email

//   // console.log('hello', currentUser);
//   // console.log(id);
//   const user = await User.findById(id);
//   const response = {
//     isLoggedIn: true,
//     name: user.name,
//     email: user.email,
//   };

//   res.json(response);

// });
router.get('/user' ,async (req, res) => {
  
  const id = req.session.passport ? req.session.passport.user : null;

  if (id) {
    const user = await User.findById(id);
    if (user) {
      const response = {
        isLoggedIn: true,
        name: user.name,
        email: user.email,
      };

      res.json(response);
    } else {
      res.json({ isLoggedIn: false });
    }
  } else {
    res.json({ isLoggedIn: false });
  }
});

//local auth signup
router.post('/signup', (req, res, next) => {
  let success = false;
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    if (!user) {
      console.log('not a user');
      return res
        .status(401)
        .json({ success: success, message: 'Incorrect email or password' });
    }

    req.login(user, (err) => {
      if (err) {
        console.log('auth error');
        return next(err);
      }
      success = true;
      res.cookie('name', req.user.name);
      res.cookie('email', req.body.email);
      res.cookie('userId', req.user.id);
      // console.log('confirm');
      return res.status(200).json({ success: success, user: req.user });
    });
  })(req, res, next);
});

//local auth sign in
router.post('/login', (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local-signin', (err, user, info) => {
    let success = false;
    if (err) {
      //   console.log("41", err)
      return next(err);
    }

    if (!user) {
      // console.log('not a user');
      // req.flash('notify', 'This is a test notification.');
      return res
        .status(401)
        .json({ success: success, message: 'Incorrect email or password' });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // console.log(user);

      res.cookie('name', user.name);
      res.cookie('email', user.email);
      res.cookie('userId', user._id);
      success = true;
      var userI = { name: user.name, email: user.email };
      //redirect to path containing user id2
      return res.status(200).json({ success: success, user: userI });
    });
  })(req, res, next);
});

router.get('/logout', function (req, res) {
  // console.log("Hello, it's me");
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.clearCookie('userId');
    res.clearCookie('name');
    res.clearCookie('email');
    res.clearCookie('connect.sid');

    res.status(200).json({ message: 'Successfully logged out' });
    // console.log('Hello from the other side.');
  });
});

//auth with google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// //auth google callback
router.get('/google/callback', passport.authenticate('google',{
  successRedirect: '/auth/login/success',
  failureRedirect: '/auth/login/failed',
}), (req, res) => {
  console.log(req.user);
  // res.cookie("email", req.user.email);
  // res.cookie("userId", req.user.id);
  // res.cookie("name", req.user.name);
});

router.get('/login/success', (req, res) => {
  let success = false;
  if (req.user) {
    // console.log("hello")
    // set the cookie set the user as authenticated
    res.cookie('email', req.user.email);
    res.cookie('userId', req.user.id);
    res.cookie('name', req.user.name);

    success = true;
    var userI = { name: req.user.name, email: req.user.email };
    //redirect to path containing user id2
    // return res.status(200).json({ success: success, user: userI });
    // req.session.loggedIn = true;
    res.redirect(`http://localhost:3000/`);
  } else {
    return res
      .status(401)
      .json({ success: success, message: 'Incorrect email or password' });
  }
  // res.redirect("/");
});
// //auth with facebook
// router.get("/facebook",
//   passport.authenticate("facebook", {
//     scope: ["public_profile", "email"]
//   })
// );

// //auth facebook callback
// router.get("/facebook/callback", passport.authenticate('facebook'), (req, res) => {
//   res.cookie("user_id", req.user.dataValues.id);
//   res.cookie("user_name", req.user.dataValues.userName);
//   return res.redirect("/");

// });

// router.get('/meetup',
//   passport.authenticate('meetup'),
//   function(req, res){
//     // The request will be redirected to Meetup for authentication, so this
//     // function will not be called.
//     console.log("150")
//   });

// // GET /auth/meetup/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary route function function will be called,
// //   which, in this example, will redirect the user to the home page.
// router.get('/meetup/callback',
//   passport.authenticate('meetup', { failureRedirect: '/landing' }),
//   function(req, res) {
//     console.log("meetup161")
//     res.redirect('/');
//   });

module.exports = router;
