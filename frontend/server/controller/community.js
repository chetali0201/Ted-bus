const mongoose = require('mongoose');

const Customer = require('../models/customer');
const CommunityPost = require('../models/communityPost');
const CommunityComment = require('../models/communityComment');
const CommunityLike = require('../models/communityLike');
const CommunityReport = require('../models/communityReport');
const CommunityThread = require('../models/communityDiscussionThread');
const CommunityReply = require('../models/communityDiscussionReply');

function getLoggedInUser(req) {
  const userId = req.body?.userId || req.query?.userId;
  if (!userId) return null;
  return userId;
}

async function requireUser(req, res) {
  try {
    const userId = getLoggedInUser(req);
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    const user = await Customer.findById(userId).lean().exec();
    if (!user) return res.status(401).json({ message: 'Invalid user' });

    return user;
  } catch (e) {
    return res.status(500).json({ message: 'Auth validation error', error: String(e) });
  }
}

async function requireAdmin(req, res) {
  const user = await requireUser(req, res);
  if (!user || res.headersSent) return null;
  if (!user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  return user;
}

// Posts
exports.createPost = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { type, title, content, routeId, destination, photoUrl } = req.body;
    const post = await CommunityPost.create({
      userId: user._id,
      type,
      title,
      content,
      routeId,
      destination,
      photoUrl,
    });
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create post', error: String(e) });
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const l = Number(limit);

    const posts = await CommunityPost.find({ status: 'active' })
      .sort({ engagementScore: -1 })
      .limit(l)
      .lean()
      .exec();

    res.json({ posts });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch trending posts', error: String(e) });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await CommunityPost.findById(postId).lean().exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comments = await CommunityComment.find({ postId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json({ post, comments });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch post', error: String(e) });
  }
};

exports.updatePost = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;
    const post = await CommunityPost.findById(postId).exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { type, title, content, routeId, destination, photoUrl } = req.body;

    post.type = type ?? post.type;
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.routeId = routeId ?? post.routeId;
    post.destination = destination ?? post.destination;
    post.photoUrl = photoUrl ?? post.photoUrl;

    await post.save();
    res.json(post);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update post', error: String(e) });
  }
};

exports.deletePost = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;
    const post = await CommunityPost.findById(postId).exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await CommunityLike.deleteMany({ postId });
    await CommunityComment.deleteMany({ postId });
    await CommunityReport.deleteMany({ postId });
    await CommunityPost.findByIdAndDelete(postId);

    res.json({ message: 'Post deleted' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete post', error: String(e) });
  }
};

// Likes
exports.likePost = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId).exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await CommunityLike.updateOne(
      { postId, userId: user._id },
      { $setOnInsert: { postId, userId: user._id } },
      { upsert: true }
    );

    const likesCount = await CommunityLike.countDocuments({ postId });
    const commentsCount = await CommunityComment.countDocuments({ postId });

    post.likesCount = likesCount;
    post.commentsCount = commentsCount;
    post.engagementScore = likesCount * 2 + commentsCount * 3;
    await post.save();

    res.json({ message: 'Liked' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to like', error: String(e) });
  }
};

exports.unlikePost = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;

    await CommunityLike.deleteOne({ postId, userId: user._id });

    const post = await CommunityPost.findById(postId).exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likesCount = await CommunityLike.countDocuments({ postId });
    const commentsCount = await CommunityComment.countDocuments({ postId });

    post.likesCount = likesCount;
    post.commentsCount = commentsCount;
    post.engagementScore = likesCount * 2 + commentsCount * 3;
    await post.save();

    res.json({ message: 'Unliked' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to unlike', error: String(e) });
  }
};

// Comments
exports.addComment = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await CommunityPost.findById(postId).exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await CommunityComment.create({ postId, userId: user._id, text });

    const likesCount = await CommunityLike.countDocuments({ postId });
    const commentsCount = await CommunityComment.countDocuments({ postId });

    post.likesCount = likesCount;
    post.commentsCount = commentsCount;
    post.engagementScore = likesCount * 2 + commentsCount * 3;
    await post.save();

    res.status(201).json(comment);
  } catch (e) {
    res.status(400).json({ message: 'Failed to add comment', error: String(e) });
  }
};

exports.updateComment = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { commentId } = req.params;
    const comment = await CommunityComment.findById(commentId).exec();
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    comment.text = req.body?.text ?? comment.text;
    await comment.save();

    res.json(comment);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update comment', error: String(e) });
  }
};

exports.deleteComment = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { commentId } = req.params;
    const comment = await CommunityComment.findById(commentId).exec();
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const postId = comment.postId;

    await CommunityComment.findByIdAndDelete(commentId);

    const post = await CommunityPost.findById(postId).exec();
    if (post) {
      const likesCount = await CommunityLike.countDocuments({ postId });
      const commentsCount = await CommunityComment.countDocuments({ postId });
      post.likesCount = likesCount;
      post.commentsCount = commentsCount;
      post.engagementScore = likesCount * 2 + commentsCount * 3;
      await post.save();
    }

    res.json({ message: 'Comment deleted' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete comment', error: String(e) });
  }
};

// Reports
exports.reportPost = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;
    const { reason } = req.body;

    const post = await CommunityPost.findById(postId).exec();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const report = await CommunityReport.create({
      postId,
      userId: user._id,
      reason: reason || 'Reported',
      status: 'open',
    });

    res.status(201).json(report);
  } catch (e) {
    res.status(400).json({ message: 'Failed to report post', error: String(e) });
  }
};

// Forum
exports.createThread = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { category, title, content } = req.body;

    const thread = await CommunityThread.create({
      userId: user._id,
      category,
      title,
      content,
    });

    res.status(201).json(thread);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create thread', error: String(e) });
  }
};

exports.getThreadsByCategory = async (req, res) => {
  try {
    const { category = 'Routes' } = req.query;
    const threads = await CommunityThread.find({ category })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    res.json({ threads });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch threads', error: String(e) });
  }
};

exports.getThreadById = async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await CommunityThread.findById(threadId).lean().exec();
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const replies = await CommunityReply.find({ threadId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json({ thread, replies });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch thread', error: String(e) });
  }
};

exports.addReply = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { threadId } = req.params;
    const { text } = req.body;

    const thread = await CommunityThread.findById(threadId).exec();
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const reply = await CommunityReply.create({ threadId, userId: user._id, text });
    res.status(201).json(reply);
  } catch (e) {
    res.status(400).json({ message: 'Failed to add reply', error: String(e) });
  }
};

exports.deleteThread = async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const { threadId } = req.params;

    const thread = await CommunityThread.findById(threadId).exec();
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    if (thread.userId.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await CommunityReply.deleteMany({ threadId });
    await CommunityThread.findByIdAndDelete(threadId);

    res.json({ message: 'Thread deleted' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete thread', error: String(e) });
  }
};

// Profile stats
exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const totalPosts = await CommunityPost.countDocuments({ userId });
    const totalComments = await CommunityComment.countDocuments({ userId });

    const likesReceivedAgg = await CommunityLike.aggregate([
      { $lookup: { from: 'communityposts', localField: 'postId', foreignField: '_id', as: 'post' } },
      { $unwind: '$post' },
      { $match: { 'post.userId': new mongoose.Types.ObjectId(userId) } },
      { $count: 'count' },
    ]);

    const likesReceived = likesReceivedAgg[0]?.count || 0;

    res.json({ totalPosts, likesReceived, totalComments });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get stats', error: String(e) });
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    const recentPosts = await CommunityPost.find({ userId }).sort({ createdAt: -1 }).limit(5).lean().exec();
    const recentComments = await CommunityComment.find({ userId }).sort({ createdAt: -1 }).limit(5).lean().exec();
    const recentThreads = await CommunityThread.find({ userId }).sort({ createdAt: -1 }).limit(5).lean().exec();

    res.json({ recentPosts, recentComments, recentThreads });
  } catch (e) {
    res.status(500).json({ message: 'Failed to get activities', error: String(e) });
  }
};

// Admin
exports.adminGetReports = async (req, res) => {
  const user = await requireAdmin(req, res);
  if (!user) return;

  try {
    const reports = await CommunityReport.find({ status: 'open' }).sort({ createdAt: -1 }).lean().exec();
    res.json({ reports });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch reports', error: String(e) });
  }
};

exports.adminDeletePost = async (req, res) => {
  const user = await requireAdmin(req, res);
  if (!user) return;

  try {
    const { postId } = req.params;
    await CommunityLike.deleteMany({ postId });
    await CommunityComment.deleteMany({ postId });
    await CommunityReport.deleteMany({ postId });
    await CommunityPost.findByIdAndDelete(postId);

    res.json({ message: 'Post removed by admin' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete post', error: String(e) });
  }
};

exports.adminUpdateReportStatus = async (req, res) => {
  const user = await requireAdmin(req, res);
  if (!user) return;

  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await CommunityReport.findById(reportId).exec();
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status || report.status;
    await report.save();

    res.json(report);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update report', error: String(e) });
  }
};

exports.adminUpdateThreadStatus = async (req, res) => {
  const user = await requireAdmin(req, res);
  if (!user) return;

  try {
    const { threadId } = req.params;
    const { status } = req.body;

    const thread = await CommunityThread.findById(threadId).exec();
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    thread.status = status || thread.status;
    await thread.save();

    res.json(thread);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update thread status', error: String(e) });
  }
};

