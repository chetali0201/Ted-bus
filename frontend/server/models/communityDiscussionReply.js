const mongoose = require('mongoose');
const { Schema } = mongoose;

const communityDiscussionReplySchema = new Schema(
  {
    threadId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CommunityDiscussionThreads' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customers' },
    text: { type: String, required: true },
    status: { type: String, required: true, default: 'active', enum: ['active', 'deleted'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityDiscussionReplies', communityDiscussionReplySchema);

