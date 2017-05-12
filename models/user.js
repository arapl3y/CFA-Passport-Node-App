var mongoose = require('mongoose');
// Bcrypt for hashing passwords
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
});

// Allow access to User model outside of this file
var User = module.exports = mongoose.model('User', UserSchema);

// Function to create a new user
module.exports.createUser = (newUser, callback) => {
  // Code from Bcrypt docs to hash password
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  // Username matches username that is brought in
  var query = { username: username };
  // Find a user in which the query is true and once
  // established run the callback
  User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  // Find a user according to id
  User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  // Pass in the candidate password, compare it to the hash
  // isMatch could be called res, isMatch makes it more obvious
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    // If there is a match the callback is invoked
    callback(null, isMatch);
  });
};
