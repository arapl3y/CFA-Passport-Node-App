const mongoose = require('mongoose');
// Bcrypt for hashing passwords
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
});

// Allow access to User model outside of this file
const User = module.exports = mongoose.model('User', UserSchema);

// Function to create a new user
module.exports.createUser = (newUser, callback) => {
  // Code from Bcrypt docs to hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = (username, callback) => {
  // Username matches username that is brought in
  const query = { username: username };
  // Find a user in which the query is true and once
  // established run the callback
  User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
  // Find a user according to id
  User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  // Pass in the candidate password, compare it to the hash
  // isMatch could be called res, isMatch makes it more obvious
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    // If there is a match the callback is invoked
    callback(null, isMatch);
  });
};
