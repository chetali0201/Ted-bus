const mongoose = require('mongoose');
const { Schema } = mongoose;

const communityPostSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customers' },

    // type: story | tip | photo
    type: { type: String, required: true, enum: ['story', 'tip', 'photo'] },

    title: { type: String, required: false, default: '' },
    content: { type: String, required: false, default: '' },

    routeId: { type: String, required: false },
    destination: { type: String, required: false },

    photoUrl: { type: String, required: false, default: '' },

    likesCount: { type: Number, required: true, default: 0 },
    commentsCount: { type: Number, required: true, default: 0 },
    engagementScore: { type: Number, required: true, default: 0 },

    status: { type: String, required: true, default: 'active', enum: ['active', 'deleted'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityPosts', communityPostSchema);

