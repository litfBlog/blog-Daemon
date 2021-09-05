/**
 * 登录查询功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const loginStatus = require('express')()
const users = require('./../../modules/users')

// 已在 app.js 声明路由
loginStatus.use(async (req, res) => {
  if (req.session.isLogin) {
    let user = await users.findOne({ _id: req.session.uid })
    res.send({
      code: 200, data: {
        isLogin: true,
        userName: req.session.userName,
        avatar: user.avatar,
        email: req.session.email,
        status: req.session.status,
        permission: req.session.permission
      }
    })
  } else {
    res.send({
      code: 200,
      data: {
        isLogin: false
      }
    })
  }
})

module.exports = loginStatus
