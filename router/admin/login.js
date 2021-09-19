/**
 * 登录功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const login = require('express')()
const users = require('./../../modules/users')
const md5 = require('md5')

login.use('/unlogin', (req, res) => {
  // console.log(req.session);
  req.session.adminIsLogin = false
  // console.log(req.session);
  logger.info(`用户退出登录 ${JSON.stringify(req.session)}`)
  res.send({ code: 200, msg: '退出成功' })
})

// 已在 app.js 声明路由
login.use(async (req, res) => {
  logger.info(`用户登录 ip:${req.userip} ${JSON.stringify(req.body)}`)
  console.log(req.body);
  let { passWord1, passWord2, passWord3 } = req.body
  let passWord = passWord1 + passWord2 + passWord3
  passWord = md5(md5(passWord))

  if (passWord === config.admin_key_2md5) {
    req.session.adminIsLogin = true
    req.session.date = Date.now()
    res.send({ code: 200, msg: '登录成功' })
    logger.info(`用户登录成功 ip:${req.userip} ${JSON.stringify(req.session)}`)
  } else {
    req.session = null
    res.send({ code: 403, msg: '账号或密码错误' })
    logger.info(`用户登录失败 ip:${req.userip} ${JSON.stringify(req.body)}`)
  }
})

module.exports = login
