const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
  _id: {
    type: Number,
    // required: true,
    // unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  avatar: {
    type: String
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
    type: mongoose.Schema.Types.Number,
    ref: 'User',
  },
  status: {
    type: Number,
    default: 0,
  },
  dataUuid: {
    type: String
  },
  edits: {
    type: [Object]
  }
  // 后续可能会加入评论等功能
})
const docs = mongoose.model('Docs', docSchema)

module.exports = docs
