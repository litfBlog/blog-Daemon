/**
 * 登录功能
 * @Author: litfa
 * @Date: 2021-8-28
 */

const register = require('express')()
const users = require('./../../modules/users')

const sendMail = require("./../../modules/sendMail")

register.use('/find', async (req, res) => {
  let { userName, email } = req.body
  console.log(req.body);
  let doc
  if (userName) {
    doc = await users.findOne({ userName })
  } else if (email) {
    doc = await users.findOne({ email })
  }
  if (doc) {
    res.send({ code: 200, status: 'no' })
  } else {
    res.send({ code: 200, status: "ok" })
  }
})

// 已在 app.js 声明路由
register.use('/auth', async (req, res) => {
  let { userName, email, passWord, authCode } = req.body

  if (!/^[a-z0-9_-]{3,16}$/.test(userName)) return res.send({ code: 403, msg: '用户名有误' })
  if (!/^[a-z0-9_-]{6,18}$/.test(passWord)) return res.send({ code: 403, msg: '密码格式有误' })
  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  let doc = await users.findOne({ userName })
  if (doc) return res.send({ code: 403, msg: '该用户名已被占用' })
  let doc1 = await users.findOne({ email })
  if (doc1) return res.send({ code: 403, msg: '该邮箱已注册' })
  if ((req.session.mailDate + (1000 * 60)) < Date.now()) {
    return res.send({ code: 200, msg: '获取过于频繁' })
  }

  let code = ""
  for (let i = 1; i <= 6; i++) {
    code += Math.floor(Math.random() * 10)
  }
  req.session.mailCode = code
  req.session.mailDate = Date.now()

  sendMail(email, 'html', '用户注册-验证码', `
    您的验证码是 ${code}
  `)

  res.send({ code: 200, msg: '发送成功' })
})

register.use('/register', async (req, res) => {
  let { userName, email, passWord, authCode, emailCode } = req.body

  if (!/^[a-z0-9_-]{3,16}$/.test(userName)) return res.send({ code: 403, msg: '用户名有误' })
  if (!/^[a-z0-9_-]{6,18}$/.test(passWord)) return res.send({ code: 403, msg: '密码格式有误' })
  if (authCode != req.session.authCode) return res.send({ code: 403, msg: '验证码错误' })
  req.session.authCode = null
  if (emailCode != req.session.mailCode) return res.send({ code: 403, msg: '邮箱验证码错误' })
  let doc = await users.findOne({ userName })
  if (doc) return res.send({ code: 403, msg: '该用户名已被占用' })
  let doc1 = await users.findOne({ email })
  if (doc1) return res.send({ code: 403, msg: '该邮箱已注册' })

  console.log((req.session.mailDate + (1000 * 60)) < Date.now());
  console.log((req.session.mailDate + (1000 * 60 * 5)) > Date.now());
  console.log(req.session);

  if (
    (req.session.mailDate + (1000 * 60 * 5)) > Date.now()
  ) { } else {
    return res.send({ code: 403, msg: '验证码已过期' })
  }

  users.create({
    userName, email, passWord
  }).then(doc => {
    res.send({ code: 200, msg: '注册成功' })
  }).catch(err => {
    res.send({ code: 500, msg: '注册失败' })
  })
})

module.exports = register