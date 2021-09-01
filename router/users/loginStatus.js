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
    res.send({
      code: 200, data: {
        isLogin: true,
        userName: req.session.userName,
        avatar: 'https://alongw.cn/icon/logo.jpg'
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
