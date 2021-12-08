/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:36:14 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:36:14 
 */
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
  },
  // 点赞
  likes: {
    type: [Object],
    default: []
  },
  // 权限设置
  // 不在主页显示
  noIndexView: {
    type: Boolean,
    default: false
  },
  // 不允许被搜索
  noSearch: {
    type: Boolean,
    default: false
  },
  // 密码访问
  usePassWord: {
    type: Boolean,
    default: false
  },
  // 密码
  passWord: {
    type: String
  },
  public: {
    type: Boolean,
    default: true
  }
})
const docs = mongoose.model('Docs', docSchema)

module.exports = docs
