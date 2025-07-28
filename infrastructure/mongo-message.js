// MongoDB message schema for dating app
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  matchId: { type: String, required: true },
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String },
  sentAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);
