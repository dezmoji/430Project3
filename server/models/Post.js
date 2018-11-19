const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let PostModel = {};

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  body: {
    type: String,
    required: true,
    trim: true,
  },

  createdBy: {
    type: String,
    required: true,
  },

  ownerID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// format how data is sent to the client
PostSchema.statics.toAPI = doc => ({
  title: doc.title,
  description: doc.description,
  body: doc.body,
  createdBy: doc.createdBy,
  ownerID: doc.ownerID,
  createdDate: doc.createdDate,
  _id: doc._id,
});

// find the most recent posts
PostSchema.statics.findMostRecent = callback => {
  PostModel.find().sort({ createdDate: -1 }).exec(callback);
};

// find posts by document ID
PostSchema.statics.findByID = (docID, callback) => {
  const search = {
    _id: docID,
  };

  return PostModel.findOne(search).exec(callback);
};

// remove post using document ID
PostSchema.statics.removeByID = (docID, callback) => {
  const search = {
    _id: docID,
  };

  return PostModel.find(search).remove().exec(callback);
};

// update post using docID
PostSchema.statics.updatePostByID = (id, doc, callback) => {
  const search = {
    _id: id,
  };

  return PostModel.findOneAndUpdate(search,
    { title: doc.title, description: doc.description, body: doc.body }, callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
