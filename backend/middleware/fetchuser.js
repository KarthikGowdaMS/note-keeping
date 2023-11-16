function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('Authenticated');
    next();
  } else {
    res.status(401).json({ error: 'Not Authorized' });
  }
}

module.exports = checkAuthenticated;
