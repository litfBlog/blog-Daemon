/**
 * 登录功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const login = require('express')()
const users = require('./../../modules/users')

// 已在 app.js 声明路由
login.use(async (req, res) => {
  let { userName, passWord, authCode } = req.body
  console.log(req.body);

  // console.log(req.session)
  // req.session.isLogin = 'set'
  // console.log(req.session)
  // res.send(123)
  // return
  let doc = await users.findOne({ userName })
  if (doc && doc.userName == userName && doc.passWord == passWord) {
    req.session.isLogin = true
    req.session.status = doc.status
    req.session.permission = doc.permission
    req.session.userName = doc.userName
    req.session.uid = doc._id
    res.send({ code: 200, msg: '登录成功' })
  } else {
    req.session = null
    res.send({ code: 403, msg: '账号或密码错误' })
  }
})

module.exports = login
