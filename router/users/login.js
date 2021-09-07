/**
 * 登录功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const login = require('express')()
const users = require('./../../modules/users')
const md5 = require('md5')

login.use('/unlogin', (req, res) => {
  console.log(req.session);
  req.session.isLogin = false
  console.log(req.session);
  res.send({ code: 200, msg: '退出成功' })
})

// 已在 app.js 声明路由
login.use(async (req, res) => {
  console.log(req.body);
  let { userName, passWord, authCode } = req.body
  authCode = authCode.toLowerCase()
  console.log(req.body);

  if (
    /^[a-z0-9_-]{3,16}$/.test(userName) &&
    /^[a-z0-9_-]{6,18}$/.test(passWord) &&
    /^[a-zA-Z0-9]{4,4}$/.test(authCode)
  ) { } else return res.send({ code: 403, msg: '表单格式错误' })

  if (req.session.authCode != authCode) {
    req.session.authCode = null
    res.send({ code: 403, msg: '验证码错误' })
    return
  }

  let doc = await users.findOne({ userName })
  if (doc && doc.userName == userName && doc.passWord == md5(md5(passWord) + 'xingWiki')) {
    req.session.isLogin = true
    req.session.status = doc.status
    req.session.permission = doc.permission
    req.session.userName = doc.userName
    req.session.email = doc.email
    req.session.uid = doc._id
    req.session.authCode = null
    res.send({ code: 200, msg: '登录成功' })
  } else {
    req.session = null
    res.send({ code: 403, msg: '账号或密码错误' })
  }
})

module.exports = login
