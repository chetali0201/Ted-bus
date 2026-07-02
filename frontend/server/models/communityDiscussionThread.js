const mongoose = require('mongoose');
const { Schema } = mongoose;

const communityDiscussionThreadSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customers' },

    category: {
      type: String,
      required: true,
      enum: ['Routes', 'Destinations', 'TravelAdvice'],
    },

    title: { type: String, required: true },
    content: { type: String, required: false, default: '' },

    status: { type: String, required: true, default: 'active', enum: ['active', 'deleted'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityDiscussionThreads', communityDiscussionThreadSchema);

