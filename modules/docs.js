const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
  _id: {
    type: Number
  },
  // 标题
  title: {
    type: String,
    required: true
  },
  // 简介
  info: {
    type: String,
    required: true
  },
  // 头像url
  avatar: {
    type: String
  },
  // 内容
  content: {
    type: String,
    required: true
  },
  // 发布时间
  date: {
    type: String,
    required: true
  },
  // 作者uid
  author: {
    type: mongoose.Schema.Types.Number,
    ref: 'User'
  },
  // 状态
  status: {
    type: Number,
    default: 0
  },
  // 静态资源id
  dataUuid: {
    type: String
  },
  // 编辑记录
  edits: {
    type: [Object]
  },
  // 阅读量
  views: {
    type: [Object],
    default: []
  }
})
const docs = mongoose.model('Docs', docSchema)

module.exports = docs
