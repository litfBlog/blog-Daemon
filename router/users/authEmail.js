/**
 * 邮箱验证码
 */

const register = require('express')()
const users = require('./../../modules/users')

const sendMail = require("./../../modules/sendMail")

const md5 = require('md5')


// 已声明路由
register.use(async (req, res) => {
  logger.info(`获取邮箱验证码 ${req.userip} ${JSON.stringify(req.body)}`)
  let { userName, email, passWord, authCode } = req.body

  if (!/^[a-z0-9_-]{3,16}$/.test(userName)) return res.send({ code: 403, msg: '用户名有误' })
  if (!/^[a-z0-9_-]{6,18}$/.test(passWord)) return res.send({ code: 403, msg: '密码格式有误' })
  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  let doc = await users.findOne({ userName })
  if (doc) return res.send({ code: 403, msg: '该用户名已被占用' })
  let doc1 = await users.findOne({ email })
  if (doc1) return res.send({ code: 403, msg: '该邮箱已注册' })
  // console.log((req.session.mailDate + (1000 * 60)), Date.now());
  // console.log((req.session.mailDate + (1000 * 60)) < Date.now());
  if ((req.session.mailDate + (1000 * 60)) > Date.now()) {
    return res.send({ code: 200, msg: '获取过于频繁' })
  }

  let code = ""
  for (let i = 1; i <= 6; i++) {
    code += Math.floor(Math.random() * 10)
  }
  req.session.mailCode = code
  req.session.mailDate = Date.now()
  req.session.mailCode_Mail = email
  sendMail(email, 'html', '用户注册-验证码', `
    您的验证码是 ${code}
  `)

  res.send({ code: 200, msg: '发送成功' })
})

module.exports = register