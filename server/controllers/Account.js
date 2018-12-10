const models = require('../models');
const nodemailer = require('nodemailer');
const generator = require('generate-password');

// create a transporter allowing emails to be sent from
// a gmail account created for the app
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fumblr.app@gmail.com',
    pass: 'FumblrPass1',
  },
});

// function to insert data to be mailed
const mailOptions = (recipient, password) => ({
  from: 'fumblr.app@gmail.com',
  to: recipient,
  subject: 'Fumblr Password Recovery',
  text: `Your new password is: ${password}`,
});

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

// renders the account handlebar view
const accountPage = (req, res) => {
  res.render('account', { csrfToken: req.csrfToken() });
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
  req.body.email = `${req.body.email}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // make sure all fields are entered
  if (!req.body.email || !req.body.username ||
    !req.body.pass || !req.body.pass2 || !req.body.email) {
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
      email: req.body.email,
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
        return res.status(400).json({ error: 'Username or email already in use' });
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

      return Account.AccountModel.updatePasswordByID(req.session.account._id,
      updatedData, (err2, doc2) => {
        if (err2 || !doc2) return res.status(400).json({ error: 'An error occured' });
        return res.status(204).json();
      });
    });
  });
};

// sends an email if user has forgotten their password
const forgotPassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.email = `${req.body.email}`;

  // first check to see if the username and email combination is a match
  return Account.AccountModel.confirmUser(req.body.username, req.body.email,
    (err, doc) => {
      // nothing found
      if (err || !doc) {
        return res.status(400).json({ error: 'An error occured' });
      }

      // generate a random alphanumeric password to be sent to the user
      const pass = generator.generate({
        length: 12,
        numbers: true,
      });

      // try to send the email to the user
      return transporter.sendMail(mailOptions(req.body.email, pass), (err2, info) => {
        // if the email could not be sent
        if (err2 || !info) {
          console.log(err2);
          return res.status(400).json({ error: 'An error occured. Please try again later' });
        }

        // generate a new hash and salt using the random password
        return Account.AccountModel.generateHash(pass, (salt, hash) => {
          //  create updatedData
          const updatedData = {
            salt,
            password: hash,
          };

          // reset the salt and password for the user
          return Account.AccountModel.updatePasswordByID(doc._id,
            updatedData, (err3, doc2) => {
              if (err3 || !doc2) {
                console.log(err3);
                return res.status(400).json({ error: 'An error occured here' });
              }
              return res.status(204).json();
            });
        });
      });
    });
};

// returns user information by username
const getUser = (request, response) => {
  const req = request;
  const res = response;

  // set a query value
  let query = req.query.user || null;

  // if the path is getAccount, then the user is trying to view their own information
  if (req.path === '/getAccount') query = req.session.account.username;

  return Account.AccountModel.findByUsername(query, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ user: doc });
  });
};

// updates email and about section for users
const updateAccount = (request, response) => {
  const req = request;
  const res = response;

  const updatedData = {
    email: req.body.email,
    about: req.body.about,
  };

  return Account.AccountModel.updateAccount(req.body.username, updatedData,
  (err, doc) => {
    if (err || !doc) return res.status(400).json({ error: 'An error occured' });

    return res.status(200).json({ redirect: '/account' });
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
module.exports.accountPage = accountPage;
module.exports.login = login;
module.exports.changePass = changePassword;
module.exports.forgotPass = forgotPassword;
module.exports.updateAccount = updateAccount;
module.exports.getUser = getUser;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
