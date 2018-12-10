const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },

  email: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },

  about: {
    type: String,
    required: false,
    trim: true,
    default: 'User has not filled out their about section yet.',
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// format how data is sent to the client
AccountSchema.statics.toAPI = doc => ({
  username: doc.username,
  email: doc.email,
  about: doc.about,
  _id: doc._id,
});

// validate password
const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

// search for account by username
AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

// generate hash for password
AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

// authenticate username and password to check for a correct login
AccountSchema.statics.authenticate = (username, password, callback) =>
AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

// update post using docID
AccountSchema.statics.updatePasswordByID = (id, doc, callback) => {
  const search = {
    _id: id,
  };

  return AccountModel.findOneAndUpdate(search,
    { salt: doc.salt, password: doc.password }, callback);
};

// update account email/about
AccountSchema.statics.updateAccount = (username, doc, callback) => {
  const search = {
    username,
  };

  return AccountModel.findOneAndUpdate(search,
    { email: doc.email, about: doc.about }, callback);
};

// confirm that a user and email match exists by finding a doc or not
AccountSchema.statics.confirmUser = (username, email, callback) => {
  const search = {
    username,
    email,
  };

  return AccountModel.findOne(search).exec(callback);
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
