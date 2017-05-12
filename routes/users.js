const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// Render register view/template
router.get('/register', (req, res) => {
  res.render('register');
});


// Register login view/template
router.get('/login', (req, res) => {
  res.render('login');
});

// Register User Post
router.post('/register', (req, res) => {
  // Hold form values in variables
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  // Validate values from the form
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Set validation errors (express method)
  const errors = req.validationErrors();

  // Check for validation errors
  if (errors) {
    res.render('register', {
      errors: errors,
    });
  } else {
    const newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });

    req.flash('success_msg', 'You are registered and can now log in');

    res.redirect('/users/login');
  }
});

// Passport local strategy
// Call functions defined in the model
// done() = passport 'verify callback', purpose is to find the user
// that possesses a set of credentials
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Model function to get User by username, takes a username
    // And a function that takes an error and a user
    User.getUserByUsername(username, (err, user) => {
      // If error, show error
      if (err) throw err;
      // If no user match, no handshake/verification with passport
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      // Model function takes a password, the user's password
      // And a function which takes an error and checks for match
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        // If there is a match, handshake with passport using that user
        if (isMatch) {
          return done(null, user);
        } else {
          // If password does not match, no handshake with passport
          done(null, false, { message: 'Incorrect password' });
        }
      });
    });
  }));

// Done === callback
// user's id is saved in the session: req.session.passport.user = {id: '..'}
// serialize user determines which data of the user object should
// be stored in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// User is retrieved according to id supplied in serializeUser
// http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/login',
  // Add options to authentication
  passport.authenticate('local', {
    // Success go to root
    successRedirect: '/',
    // Failure go to login page
    failureRedirect: '/users/login',
    // Show failure flash message
    failureFlash: true,
  }),

  (req, res) => {
    res.redirect('/');
  });

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
