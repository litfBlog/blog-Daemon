/**
 * 登录功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const register = require('express')()
const users = require('./../../modules/users')

// 已在 app.js 声明路由
register.use('/register', (req, res) => {
  let { userName, email, password, authCode } = req.body
})
// users.create({
//   userName: 'admin',
//   password: '1',
//   email: 'admin@litf.com.cn',
//   status: 1,
//   permission: 'admin',
// })

module.exports = register
