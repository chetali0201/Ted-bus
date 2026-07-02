const mongoose = require('mongoose');
const { Schema } = mongoose;

const communityReportSchema = new Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CommunityPosts' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customers' },
    reason: { type: String, required: true, default: 'Reported' },
    status: { type: String, required: true, default: 'open', enum: ['open', 'resolved', 'dismissed'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommunityReports', communityReportSchema);

