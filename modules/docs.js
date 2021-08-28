const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
  status: {
    type: Number,
    default: 0,
  },
  // 后续可能会加入评论等功能
})
const user = mongoose.model('User', userSchema)

module.exports = user
