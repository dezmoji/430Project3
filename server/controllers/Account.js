const models = require('../models');

const Account = models.Account;

// renders the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// renders the changepass handlebar view
const passPage = (req, res) => {
  res.render('changepass', { csrfToken: req.csrfToken() });
};

// renders the user handlebar view
const userPage = (req, res) => {
  res.render('user', { csrfToken: req.csrfToken() });
};

// destroy the current session and go to login page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

//  handles login
const login = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // make sure all fields are entered
  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // authenticate username and password
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    // return error message if wrong username or password
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // set the session account
    req.session.account = Account.AccountModel.toAPI(account);

    // redirect to the dashboard
    return res.json({ redirect: '/dashboard' });
  });
};

//  handles sign up
const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // make sure all fields are entered
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // make sure both passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // generate hash for password
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    // save and create the new account
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    // once the account is made, set the session account and go to dashboard
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/dashboard' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

//  handles changing passwords
const changePassword = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // make sure the old password is correct
  return Account.AccountModel.authenticate(req.session.account.username, req.body.oldPass,
  (err, doc) => {
    // if it isn't, send an error message
    if (err || !doc) {
      return res.status(401).json({ error: 'Old password is not correct.' });
    }

    // if the old password is correct, generate a new hash and salt
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      //  create updatedData
      const updatedData = {
        salt,
        password: hash,
      };

      return Account.AccountModel.updateAccountByID(req.session.account._id,
      updatedData, (err2, doc2) => {
        if (err2 || !doc2) return res.status(400).json({ error: 'An error occured' });
        return res.status(204).json();
      });
    });
  });
};

//
const getUser = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.findByUsername(req.query.user, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ user: doc, userID: req.session.account._id });
  });
};

//  get a csrf token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.passPage = passPage;
module.exports.userPage = userPage;
module.exports.login = login;
module.exports.changePass = changePassword;
module.exports.getUser = getUser;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
