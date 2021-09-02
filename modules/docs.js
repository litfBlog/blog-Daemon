const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: Number,
    default: 0,
  },
  dataUuid: {
    type: String
  }
  // 后续可能会加入评论等功能
})
const docs = mongoose.model('Docs', docSchema)

module.exports = docs
