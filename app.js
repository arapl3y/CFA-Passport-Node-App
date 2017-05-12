// Modules

// Express Framework
const express = require('express');
// Utilities for working with file and dir paths
const path = require('path');
// Parse cookies
const cookieParser = require('cookie-parser');
// Parse JSON
const bodyParser = require('body-parser');
// Express Handlebars View Engine
const exphbs = require('express-handlebars');
// Express form validation middleware
const expressValidator = require('express-validator');
// Flash messages
const flash = require('connect-flash');
// Express session middleware
const session = require('express-session');
// Passport authentication middleware
const passport = require('passport');
// Passport local authentication from DB
const LocalStrategy = require('passport-local').Strategy;
// Mongo Database
const mongo = require('mongodb');
// ORM/Object Modeling for MongoDB
const mongoose = require('mongoose');

// Create connection to DB named userauthapp
mongoose.connect('mongodb://localhost/userauthapp');

// Assign the connection to a variable db
const db = mongoose.connection;


// Routes
const routes = require('./routes/index');
const users = require('./routes/users');

// Init app
const app = express();


// View engine (Handlebars)
// Want folder views to handle views
app.set('views', path.join(__dirname, 'views'));
// Default layout in layouts folder
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');


// Config middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Public folder for publicly accessible files
app.use(express.static(path.join(__dirname, 'public')));


// Express session
app.use(session({
  // Secret can be anything
  secret: 'secret',
  saveUnitialized: true,
  resave: true,
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());


// Express Validator for form validation
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.');
      var root = namespace.shift();
      var formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect flash
app.use(flash());


// Global vars for flash messages
// (res.locals for global vars)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  // Passport's own error msg
  res.locals.error = req.flash('error');
  // If user exists, assign to variable
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);


// Set Port
app.set('port', (process.env.PORT || 3000));

// Listen on specified port number
app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'));
});
