const express = require('express');
const authRouter = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'thisismysecret';

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = await User.findOne({ email: req.body.email });
    // console.log(user);

    if (user) {
      return res.status(400).send({ success, error: 'User already exists' });
    }

    success = true;
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    const name = user.name;
    // console.log(name);
    console.log(authToken);
    res.json({ name, success, authToken });
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
    const { email, password } = req.body;
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
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success, error: 'Incorrect password' });
      }
      success = true;
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      const name = user.name;
      res.json({ name, success, authToken });
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
);

authRouter.post('/getuser', fetchuser, async function (req, res) {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select('-password');
    res.send(user);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

module.exports = authRouter;