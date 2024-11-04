const express = require('express');
const validate = require('express-validation');
const newsCommentController = require('./news-comment.controller');
const routes = express.Router();
const rules = require('./news-comment.rule');
const prefix = '/news-comment';

// Get List news comment 
routes.route('').get(newsCommentController.getListNewsComment);


routes.route('/reply').get(newsCommentController.getListReplyComment);


// Detail a news comment
routes.route('/:CommentID(\\d+)')
  .get(newsCommentController.detailNewsComment);

// Create new a news comment
routes.route('')
  .post(validate(rules.createNewsComment), newsCommentController.createNewsComment);

// Update a news comment
routes.route('/:CommentID(\\d+)')
  .put(validate(rules.updateNewsComment), newsCommentController.updateNewsComment);

// Delete a news comment
routes.route('/:CommentID(\\d+)')
  .delete(newsCommentController.deleteNewsComment);



// Like or dislike News Comment
routes.route('/like-dislike')
  .post(newsCommentController.likeOrDisLikeNewsComment);


module.exports = {
  prefix,
  routes,
};