const express = require('express');
const router = express.Router();

const communityController = require('../controller/community');

// Posts
router.post('/community/posts', communityController.createPost);
router.get('/community/posts/trending', communityController.getTrendingPosts);
router.get('/community/posts/:postId', communityController.getPostById);
router.put('/community/posts/:postId', communityController.updatePost);
router.delete('/community/posts/:postId', communityController.deletePost);

// Likes
router.post('/community/posts/:postId/like', communityController.likePost);
router.delete('/community/posts/:postId/like', communityController.unlikePost);

// Comments
router.post('/community/posts/:postId/comments', communityController.addComment);
router.put('/community/comments/:commentId', communityController.updateComment);
router.delete('/community/comments/:commentId', communityController.deleteComment);

// Reports
router.post('/community/posts/:postId/reports', communityController.reportPost);

// Forum Threads & Replies
router.post('/community/forums/threads', communityController.createThread);
router.get('/community/forums/threads', communityController.getThreadsByCategory);
router.get('/community/forums/threads/:threadId', communityController.getThreadById);
router.post('/community/forums/threads/:threadId/replies', communityController.addReply);
router.delete('/community/forums/threads/:threadId', communityController.deleteThread);

// User profile stats
router.get('/community/users/:userId/stats', communityController.getUserStats);
router.get('/community/users/:userId/activities', communityController.getUserActivities);

// Admin moderation
router.get('/community/admin/reports', communityController.adminGetReports);
router.delete('/community/admin/posts/:postId', communityController.adminDeletePost);
router.put('/community/admin/reports/:reportId/status', communityController.adminUpdateReportStatus);
router.put('/community/admin/threads/:threadId/status', communityController.adminUpdateThreadStatus);

module.exports = router;

