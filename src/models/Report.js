const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rawReport: {
    type: String,
    required: true
  },
  analysis: {
    category: String,
    severity: String,
    title: String,
    stepsToReproduce: [String],
    expectedBehavior: String,
    actualBehavior: String,
    probableRootCause: String,
    suggestedFix: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
