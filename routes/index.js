var express = require('express');
var router = express.Router();


function ensureAuthenticated(req, res, next) {
  // Express authentication method
  if (req.isAuthenticated()) {
    // Keep going
    return next();
  } else {
    // If not authenticated, redirect to login page
    // req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

// Get Homepage
// Ensure user is authenticated before rendering index
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('index');
});

module.exports = router;
