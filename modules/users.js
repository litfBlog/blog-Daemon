/*
 * @Author: litfa 
 * @Date: 2021-12-08 16:36:48 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:36:48 
 */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  _id: Number,
  // 用户名
  userName: {
    type: String,
    required: true,
    maxlength: 20
  },
  // 密码
  passWord: {
    type: String,
    required: true
  },
  // 头像
  avatar: {
    type: String
  },
  // 头像文件名
  avatarFileName: {
    type: String
  },
  // 邮箱
  email: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  // 状态
  status: {
    type: Number,
    default: 1
  },
  // 权限
  permission: {
    type: String,
    default: 'member'
  }
})
const user = mongoose.model('User', userSchema)

module.exports = user

