const mongoose = require('mongoose');
const { Schema } = mongoose;

const communityLikeSchema = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CommunityPosts' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customers' },
  },
  { timestamps: true }
);

communityLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CommunityLikes', communityLikeSchema);

