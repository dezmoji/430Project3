const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/dashboard', mid.requiresSecure, mid.requiresLogin, controllers.Post.dashPage);
  app.get('/addPost', mid.requiresSecure, mid.requiresLogin, controllers.Post.addPage);
  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.Account.accountPage);
  app.get('/getAccount', mid.requiresSecure, mid.requiresLogin, controllers.Account.getUser);
  app.get('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.Account.passPage);
  app.get('/getPosts', mid.requiresSecure, mid.requiresLogin, controllers.Post.getPosts);
  app.get('/showPost', mid.requiresSecure, mid.requiresLogin, controllers.Post.postPage);
  app.get('/showUser', mid.requiresSecure, mid.requiresLogin, controllers.Account.userPage);
  app.get('/showUserPosts', mid.requiresSecure, mid.requiresLogin, controllers.Post.userPostPage);
  app.get('/getPost', mid.requiresSecure, mid.requiresLogin, controllers.Post.getPost);
  app.get('/getUser', mid.requiresSecure, mid.requiresLogin, controllers.Account.getUser);
  app.get('/getUserPosts', mid.requiresSecure, mid.requiresLogin, controllers.Post.userPosts);
  app.get('/logout', mid.requiresSecure, mid.requiresLogin, controllers.Account.logout);
  app.post('/addPost', mid.requiresSecure, mid.requiresLogin, controllers.Post.addPost);
  app.put('/editAccount', mid.requiresSecure, mid.requiresLogin, controllers.Account.updateAccount);
  app.put('/editPost', mid.requiresSecure, mid.requiresLogin, controllers.Post.updatePost);
  app.put('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePass);
  app.put('/forgotPass', mid.requiresSecure, mid.requiresLogout, controllers.Account.forgotPass);
  app.delete('/deletePost', mid.requiresSecure, mid.requiresLogin, controllers.Post.deletePost);
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
