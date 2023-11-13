const jwt = require('jsonwebtoken');
const JWT_SECRET = 'thisismysecret';

function fetchuser(req, res, next) {
  try {
    const token = req.header('auth-token');
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    // console.log(req.user);
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate using a valid token' });
  }
}

module.exports = fetchuser;
