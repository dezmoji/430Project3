const models = require('../models');

const Post = models.Post;

// renders the app handlebar view
const dashPage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};

// renders the addpost handlebar view
const addPage = (req, res) => {
  res.render('addpost', { csrfToken: req.csrfToken() });
};

// renders the post handlebar view
const postPage = (req, res) => {
  res.render('post', { csrfToken: req.csrfToken() });
};

// renders the userPost handlebar view
const userPostPage = (req, res) => {
  res.render('userposts', { csrfToken: req.csrfToken() });
};

// handles adding a post
const addPost = (req, res) => {
  //  make sure all fields are entered
  if (!req.body.title || !req.body.description || !req.body.body) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  //  create the post data and save
  const postData = {
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
    createdBy: req.session.account.username,
    ownerID: req.session.account._id,
  };

  const newPost = new Post.PostModel(postData);

  const postPromise = newPost.save();

  // redirect to the dashboard
  postPromise.then(() => res.json({ redirect: '/dashboard' }));

  postPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists' });
    }
    return res.status(400).json({ error: 'An error occured' });
  });

  return postPromise;
};

// gets most recent posts
const getPosts = (request, response) => {
  const req = request;
  const res = response;

  return Post.PostModel.findMostRecent((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ posts: docs, userID: req.session.account._id });
  });
};

// get a specific users posts
const userPosts = (request, response) => {
  const req = request;
  const res = response;

  let query = req.query.ownerID;

  // if there is no query paramter, use the current users id
  if (!query) {
    query = req.session.account._id;
  }

  return Post.PostModel.findByOwnerID(query, (err, docs) => {
    if (err || !docs) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ posts: docs, userID: req.session.account._id, createdBy: docs[0].createdBy });
  });
};

// gets a singular post
const getPost = (request, response) => {
  const req = request;
  const res = response;

  // find a post by the doc ID passed in as a query value
  return Post.PostModel.findByID(req.query.postID, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ error: 'An error occured.' });
    }

    return res.json({ post: doc, userID: req.session.account._id });
  });
};

// delete a post
const deletePost = (request, response) => {
  const req = request;
  const res = response;

  return Post.PostModel.removeByID(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.status(204).json();
  });
};

// update a post
const updatePost = (request, response) => {
  const req = request;
  const res = response;

  // make sure all fields are entered
  if (!req.body.title || !req.body.description || !req.body.body) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  //  create the updatedData
  const updatedData = {
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
  };

  // find a post by the document ID
  return Post.PostModel.findByID(req.body._id, (err, doc) => {
    if (err || !doc) return res.status(400).json({ error: 'An error occured' });

    return Post.PostModel.updatePostByID(req.body._id, updatedData, (err2, doc2) => {
      if (err2) {
        return res.status(400).json({ error: 'An error occured' });
      }

      return res.status(200)
        .json({ post: doc2,
          userID: req.session.account._id,
          redirect: `/showPost?postID=${req.body._id}` });
    });
  });
};

module.exports.dashPage = dashPage;
module.exports.addPage = addPage;
module.exports.getPosts = getPosts;
module.exports.userPostPage = userPostPage;
module.exports.userPosts = userPosts;
module.exports.addPost = addPost;
module.exports.deletePost = deletePost;
module.exports.getPost = getPost;
module.exports.postPage = postPage;
module.exports.updatePost = updatePost;
