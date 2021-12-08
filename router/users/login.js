/*
 * 登录功能
 * @Author: litfa 
 * @Date: 2021-12-08 16:43:36 
 * @Last Modified by:   litfa 
 * @Last Modified time: 2021-12-08 16:43:36 
 */

const login = require('express')()
const users = require('./../../modules/users')
const md5 = require('md5')

login.use('/unlogin', (req, res) => {
  req.session.isLogin = false
  logger.info(`用户退出登录 ${JSON.stringify(req.session)}`)
  res.send({ code: 200, msg: '退出成功' })
})

// 已在 app.js 声明路由
login.use(async (req, res) => {
  logger.info(`用户登录 ip:${req.userip} ${JSON.stringify(req.body)}`)
  let { userName, passWord, authCode } = req.body
  authCode = authCode.toLowerCase()

  if (
    /^[a-z0-9_-]{3,16}$/.test(userName) &&
    /^[a-z0-9_-]{6,18}$/.test(passWord) &&
    /^[a-zA-Z0-9]{4,4}$/.test(authCode)
  ) {
    // 
  } else return res.send({ code: 403, msg: '表单格式错误' })

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
    logger.info(`用户登录成功 ip:${req.userip} ${JSON.stringify(req.session)}`)
  } else {
    req.session = null
    res.send({ code: 403, msg: '账号或密码错误' })
    logger.info(`用户登录失败 ip:${req.userip} ${JSON.stringify(req.body)}`)
  }
})

module.exports = login
