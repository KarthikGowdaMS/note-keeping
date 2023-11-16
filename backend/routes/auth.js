const express = require('express');
const authRouter = express.Router();
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const checkAuthenticated = require('../middleware/fetchuser');
const User = require('../models/user').User;


authRouter.post(
  '/createuser',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
  ],
  async function (req, res) {
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, error: result.array() });
    }

    User.register(
      { name: req.body.name, email: req.body.email },
      req.body.password,
      function (err, user) {
        if (err) {
          // console.log(err);
          return res.status(400).send({ success, error: err.message });
        } else {
          passport.authenticate('local')(req, res, function () {
            user.hash = undefined;
            user.salt = undefined;
            res.status(200).json({ success: true, user });
          });
        }
      }
    );
  }
);

authRouter.post(
  '/login',
  [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'password cannot be blank').exists(),
  ],
  async function (req, res) {
    let success = false;
    const { email } = req.body;
    // console.log(req.body);

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success, error: result.array() });
    }
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ success, error: "User doesn't exist" });
      }

      req.login(user, function (err) {
        if (err) {
          console.log(err);
          res.status(401).json({ success, error: err.message });
        } else {
          passport.authenticate('local')(req, res, function () {
            res.status(200).json({ success: true, user });
          });
        }
      });
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
);

authRouter.get('/logout',function (req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.json({message: 'Logged out successfully'});
    });
});

authRouter.get('/getuser', checkAuthenticated, async function (req, res) {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select('-password');
    res.send(user.name);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

module.exports = authRouter;
